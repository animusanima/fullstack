import express, { type Application, type Request, type Response } from "express";
import { type GetTodoResponse, type Todo, todoSchema } from "shared";
import cors from "cors";
import { errorHandlerMiddleware } from "$/common/middlewares/error-handler.middleware";

const app: Application = express();

app.use(cors({
  origin: "http://localhost:5173",
  allowedHeaders: "*",
}));

app.use(express.json());

app.get("/", (_req: Request, res: Response): void => {
  const query = todoSchema.pick({
    id: true,
    title: true,
    completed: true,
  }).array().parse(_req.body) satisfies GetTodoResponse;

  const todos: Todo[] = [];

  for (const q of query) {
    const todo: Todo = {
      id: q.id,
      title: q.title,
      completed: q.completed,
    };
    todos.push(todo);
  }

  res.status(200).json(todos);
});

app.use(errorHandlerMiddleware);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
