import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import { GetTodoResponse, Todo, todoSchema } from "shared";
import cors from "cors";

const app: Application = express();

app.use(cors({
  origin: "http://localhost:5173",
  allowedHeaders: "*"
}));

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  const query = todoSchema.pick({
    id: true,
    title: true,
    completed: true
  }).array().parse(_req.body);

  const todos: Todo[] = [];

  for (const q of query) {
    const todo: Todo = {
      id: q.id,
      title: q.title,
      completed: q.completed
    };
    todos.push(todo);
  }

  //res.status(200).json({ todos }) satisfies GetTodoResponse;
  res.status(200).json({ todos });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
