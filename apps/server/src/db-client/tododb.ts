import { promises as fs } from "fs";
import { type Todo, todoSchema } from "shared";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import path from "node:path";
import {
  type ReadJsonResult,
  type DeleteArgs,
  type FindUniqueArgs,
  type DeleteManyArgs,
  type CreateArgs,
  type UpdateArgs,
} from "./api.types";

export class Database {
  constructor(private readonly filePath: string = "./store.json") {
  }

  private async readJson(): Promise<ReadJsonResult> {
    try {
      const data = await fs.readFile(path.join(__dirname, this.filePath), "utf-8");
      const deserializedData: unknown = JSON.parse(data);
      const schema = z.array(todoSchema);
      const parsedData = schema.parse(deserializedData);
      return { success: true, todos: parsedData };
    } catch (error) {
      const notFoundError = z.object({
        code: z.literal("ENOENT"),
      }).safeParse(error);

      if (notFoundError.success) {
        return { success: false, error: new Error(`file not found ${this.filePath}`) };
      } else if (error instanceof SyntaxError) {
        await fs.writeFile(path.join(__dirname, this.filePath), JSON.stringify({}), "utf-8");
        return { success: false, error: new Error(`Invalid JSON at ${this.filePath}`) };
      } else if (error instanceof z.ZodError) {
        await fs.writeFile(path.join(__dirname, this.filePath), JSON.stringify({}), "utf-8");
        return { success: false, error: new Error(`Invalid data at ${this.filePath}`) };
      }
      return { success: false, error: error instanceof Error ? error : new Error("Unknown error") };
    }
  }

  private async writeJson(todos: Todo[]): Promise<void> {
    try {
      await fs.writeFile(path.join(__dirname, this.filePath), JSON.stringify(todos), "utf-8");
    } catch (error) {
      console.log("Error writing file", error);
    }
  }

  public async create(args: CreateArgs): Promise<Todo> {
    const newTodo = { ...args, id: uuidv4() } satisfies Todo;

    const jsonResult: ReadJsonResult = await this.readJson();
    if (!jsonResult.success) {
      throw new Error("Error reading todos");
    }

    jsonResult.todos.push(newTodo);
    await this.writeJson(jsonResult.todos);
    return newTodo;
  }

  public async findUnique(args: FindUniqueArgs): Promise<Todo | undefined> {
    const jsonResult: ReadJsonResult = await this.readJson();

    if (!jsonResult.success) {
      throw new Error("Error reading todos");
    }

    return jsonResult.todos.find((todo) => todo.id === args.id);
  }

  public async update(args: UpdateArgs): Promise<Todo | undefined> {
    const jsonResult: ReadJsonResult = await this.readJson();
    if (!jsonResult.success) {
      throw new Error("Error reading todos");
    }
    const todoIndex = jsonResult.todos.findIndex((todo) => todo.id === args.id);
    if (todoIndex === -1) {
      return undefined;
    }

    const updatedTodo = {
      ...jsonResult.todos[todoIndex],
      ...args.data,
    } satisfies Todo;

    jsonResult.todos[todoIndex] = updatedTodo;
    await this.writeJson(jsonResult.todos);

    return updatedTodo;
  }

  public async deleteTodo(args: DeleteArgs): Promise<boolean> {
    const jsonResult: ReadJsonResult = await this.readJson();
    if (!jsonResult.success) {
      throw new Error("Error reading todos");
    }
    const todoIndex = jsonResult.todos.findIndex((todo) => todo.id === args.id);

    if (todoIndex === -1) {
      return false;
    }

    jsonResult.todos.splice(todoIndex, 1);
    await this.writeJson(jsonResult.todos);
    return true;
  }

  public async deleteManyTodos(args: DeleteManyArgs): Promise<void> {
    if ("clearAll" in args) {
      await this.writeJson([]);
      return;
    }

    const jsonResult: ReadJsonResult = await this.readJson();
    if (!jsonResult.success) {
      throw new Error("Error reading todos");
    }
    const newTodos = jsonResult.todos.filter((todo) => !args.ids.includes(todo.id));
    await this.writeJson(newTodos);
  }
}

export const database = new Database();