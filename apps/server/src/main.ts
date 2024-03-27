import express, { type Application } from "express";
import cors from "cors";
import { errorHandlerMiddleware } from "$/common/middlewares/error-handler.middleware";
import { todosRouter } from "$/routers/todos/todos.routers";

const app: Application = express();

app.use(cors({
  origin: "http://localhost:5173",
  allowedHeaders: "*",
}));

app.use(express.json());
app.use("/todos", todosRouter);

app.use(errorHandlerMiddleware);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// TODO: 148. Integrating the Data Access Layer
