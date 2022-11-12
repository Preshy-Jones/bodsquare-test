const express = require("express");
import { AuthorizationError, ServiceError } from "../../errors";

import { Request, Response, NextFunction } from "express";
const { models } = require("../../db");
import { io } from "socket.io-client";
const Producer = require("../../utils/Producer");
const producer = new Producer();

export const getTask = async (req: Request, res: Response) => {
  const task = await models["Task"].findByPk(req.params.id);
  res.json({ task });
};

export const saveTask = async (req: any, res: Response, next: NextFunction) => {
  req.task = models["Task"].build();
  next();
};

export const updateTask = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  req.task = await models["Task"].findByPk(req.params.id);
  next();
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await models["Task"].findAll({
      order: [["createdAt", "desc"]],
    });
    console.log(tasks);

    res.json({ tasks });
  } catch (error) {
    res.json({ error: error });
  }
};

export const deleteTask = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await models["Task"].findByPk(req.params.id);

    if (!task) {
      throw new ServiceError("Task not found");
    }
    console.log(task);

    if (task && task.userId !== req.user.id.toString()) {
      throw new AuthorizationError(
        "You are not authorized to delete this task"
      );
    } else {
      await models["Task"].destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ message: "Task deleted successfully" });
    }
  } catch (error) {
    next(error);
  }
};

export const handleTask = (operation: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    const socket = io("http://localhost:4000");
    let task = req.task;
    task.userId = req.user.id;
    task.title = req.body.title;
    task.description = req.body.description;

    try {
      //update task
      if (operation === "update") {
        task = await task.save();
        return res.json({
          message: `Task updated successfully`,
          task,
        });
      }
      console.log(operation);

      //save task
      socket.emit("newTask");
      await producer.publishMessage("Task", task);
      return res.json({
        message: `Task created successfully`,
        // task,
      });
    } catch (error) {
      // res.render(`articles/${path}`, { post: post });
      next(error);
    }
  };
};
