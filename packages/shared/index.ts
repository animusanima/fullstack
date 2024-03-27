import { z } from "zod";

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(3).max(100),
  completed: z.boolean(),
});
export type Todo = z.infer<typeof todoSchema>;

export const createTodoInput = todoSchema.pick({ description: true, title: true, completed: true });
export type CreateTodoInput = z.infer<typeof createTodoInput>;

export const updateTodoInput = todoSchema.pick({ completed: true });
export type UpdateTodoInput = z.infer<typeof updateTodoInput>;