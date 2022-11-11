"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTask = exports.deleteTask = exports.getAllTasks = exports.updateTask = exports.saveTask = exports.getTask = void 0;
const express = require("express");
const errors_1 = require("../../errors");
const Task_1 = require("../../models/Task");
const publisher_1 = require("../../utils/publisher");
const socket_io_client_1 = require("socket.io-client");
const getTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield Task_1.Task.findById(req.params.id);
    res.json({ task });
});
exports.getTask = getTask;
const saveTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.task = new Task_1.Task();
    next();
});
exports.saveTask = saveTask;
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.task = yield Task_1.Task.findById(req.params.id);
    next();
});
exports.updateTask = updateTask;
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.Task.find().sort({
            createdAt: "desc",
        });
        console.log(tasks);
        res.json({ tasks });
    }
    catch (error) {
        res.json({ error: error });
    }
});
exports.getAllTasks = getAllTasks;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.Task.findById(req.params.id);
        if (task && task.userId !== req.user._id.toString()) {
            throw new errors_1.AuthorizationError("You are not authorized to delete this task");
        }
        else {
            yield Task_1.Task.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Task deleted successfully" });
        }
    }
    catch (error) {
        res.json({ error: error });
    }
});
exports.deleteTask = deleteTask;
const handleTask = (operation) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const socket = (0, socket_io_client_1.io)("http://localhost:4000");
        let task = req.task;
        task.userId = req.user._id;
        task.title = req.body.title;
        task.description = req.body.description;
        try {
            (0, publisher_1.Publisher)("tasks", task);
            socket.emit("newTask", task);
            // task = await task.save();
            res.json({
                message: `Task ${operation === "update" ? "updated" : "created"} successfully`,
                task,
            });
        }
        catch (error) {
            // res.render(`articles/${path}`, { post: post });
            next(error);
        }
    });
};
exports.handleTask = handleTask;
