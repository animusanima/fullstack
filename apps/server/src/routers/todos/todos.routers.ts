import express, { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import { HttpStatus } from "$/common/enums/http-status.enum";
import { database } from "$/db-client/tododb";
import { z } from "zod";
import { createTodoInput, todoSchema, updateTodoInput } from "@repo/shared";

export const todosRouter = express.Router();
const createRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const input = createTodoInput.parse(req.body);
    const createdTodo = await database.create({
      title: input.title,
      completed: input.completed,
    });
    res.status(HttpStatus.OK).json(createdTodo);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
};

const updateRequest = async (_req: Request, res: Response): Promise<void> => {
  try {
    const todoId = todoSchema.shape.id.parse(_req.params.id);
    const input = updateTodoInput.parse(_req.body);

    const updatedTodo = await database.update({
      id: todoId, data: {
        completed: input.completed,
      },
    });
    res.status(HttpStatus.OK).json(updatedTodo);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
};

const deleteRequest = async (_req: Request, res: Response): Promise<void> => {
  try {
    const todoId = todoSchema.shape.id.parse(_req.params.id);
    await database.deleteTodo({ id: todoId.toString() });
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
};

const deleteManyRequest = async (_req: Request, res: Response): Promise<void> => {
  try {
    const todoIds = z.array(todoSchema.shape.id).parse(_req.params.id);
    await database.deleteManyTodos({ ids: todoIds });
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getAllTodosRequest = async (_req: Request, res: Response): Promise<void> => {
  const todos = await database.findAll();
  res.status(HttpStatus.OK).json(todos);
};

todosRouter.get("/", asyncHandler(getAllTodosRequest));

todosRouter.delete("/:id", asyncHandler(deleteRequest));

todosRouter.patch("/:id", asyncHandler(updateRequest));

todosRouter.post("/", asyncHandler(createRequest));

todosRouter.delete("/many", asyncHandler(deleteManyRequest));
