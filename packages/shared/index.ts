import { z } from "zod";

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(2).max(100),
  completed: z.boolean(),
});

export type Todo = z.infer<typeof todoSchema>;

export type GetTodoResponse = Todo[];

// TODO: 142. Reading and Writing files with Node.js
