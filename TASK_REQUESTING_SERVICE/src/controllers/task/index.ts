const express = require("express");
import { AuthorizationError } from "../../errors";

import { Request, Response, NextFunction } from "express";
import { Task } from "../../models/Task";
import { Publisher } from "../../utils/publisher";

export const getTask = async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id);
  res.json({ task });
};

export const saveTask = async (req: any, res: Response, next: NextFunction) => {
  req.task = new Task();
  next();
};

export const updateTask = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  req.task = await Task.findById(req.params.id);
  next();
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().sort({
      createdAt: "desc",
    });
    console.log(tasks);

    res.json({ tasks });
  } catch (error) {
    res.json({ error: error });
  }
};

export const deleteTask = async (req: any, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task && task.userId !== req.user._id.toString()) {
      throw new AuthorizationError(
        "You are not authorized to delete this task"
      );
    } else {
      await Task.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Task deleted successfully" });
    }
  } catch (error) {
    res.json({ error: error });
  }
};

export const handleTask = (operation: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    let task = req.task;
    task.userId = req.user._id;
    task.title = req.body.title;
    task.description = req.body.description;

    Publisher("tasks", task);

    try {
      task = await task.save();
      res.json({
        message: `Task ${
          operation === "update" ? "updated" : "created"
        } successfully`,
        task,
      });
    } catch (error) {
      // res.render(`articles/${path}`, { post: post });
      next(error);
    }
  };
};
