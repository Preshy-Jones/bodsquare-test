"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_1 = require("../../controllers/task");
const {} = require("../../controllers/task/index");
const ensureAuthenticated = require("../../middlewares/auth");
const router = express_1.default.Router();
router.get("/:id", task_1.getTask);
router.post("/", ensureAuthenticated, task_1.saveTask, (0, task_1.handleTask)("new"));
router.put("/:id", ensureAuthenticated, task_1.updateTask, (0, task_1.handleTask)("edit"));
router.get("/", task_1.getAllTasks);
router.delete("/:id", ensureAuthenticated, task_1.deleteTask);
module.exports = router;
