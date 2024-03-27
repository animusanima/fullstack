import { promises as fs } from "fs";
import { type Todo, todoSchema } from "@repo/shared";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import path from "node:path";
import {
  type CreateArgs,
  type DeleteArgs,
  type DeleteManyArgs,
  type FindUniqueArgs,
  type ReadJsonResult,
  type UpdateArgs,
} from "./api.types";
import { HttpError } from "$/common/exceptions/http-error.exception";
import { HttpStatus } from "$/common/enums/http-status.enum";

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
      return {
        success: false, error: error instanceof Error ? error : new HttpError({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Unknown error",
        }),
      };
    }
  }

  private async writeJson(todos: Todo[]): Promise<void> {
    try {
      await fs.writeFile(path.join(__dirname, this.filePath), JSON.stringify(todos), "utf-8");
    } catch (error) {
      throw new HttpError({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error writing to file",
      });
    }
  }

  public async create(args: CreateArgs): Promise<Todo> {
    const newTodo = { ...args, id: uuidv4() } satisfies Todo;

    const jsonResult: ReadJsonResult = await this.readJson();
    if (!jsonResult.success) {
      throw new HttpError({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error reading todos from path ${this.filePath}`,
      });
    }

    jsonResult.todos.push(newTodo);
    await this.writeJson(jsonResult.todos);
    return newTodo;
  }

  public async findUnique(args: FindUniqueArgs): Promise<Todo | null> {
    const jsonResult: ReadJsonResult = await this.readJson();

    if (!jsonResult.success) {
      throw new HttpError({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error finding unique todo by id",
      });
    }

    const foundTodo = jsonResult.todos.find((todo) => todo.id === args.id);
    return foundTodo ?? null;
  }

  public async findAll(): Promise<Todo[]> {
    const jsonResult: ReadJsonResult = await this.readJson();
    if (!jsonResult.success) {
      throw new HttpError({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error finding all todos`,
      });
    }
    return jsonResult.todos;
  }

  public async update(args: UpdateArgs): Promise<Todo | null> {
    const jsonResult: ReadJsonResult = await this.readJson();
    if (!jsonResult.success) {
      throw new HttpError({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error updating todo",
      });
    }
    const todoIndex = jsonResult.todos.findIndex((todo) => todo.id === args.id);
    if (todoIndex === -1) {
      return null;
    }

    const updatedTodo = {
      ...jsonResult.todos[todoIndex],
      ...args.data,
    } satisfies Todo;

    jsonResult.todos[todoIndex] = updatedTodo;
    await this.writeJson(jsonResult.todos);

    return updatedTodo;
  }

  public async deleteTodo(args: DeleteArgs): Promise<void> {
    const jsonResult: ReadJsonResult = await this.readJson();
    if (!jsonResult.success) {
      throw new HttpError({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error reading todos from path ${this.filePath}`,
      });
    }
    const todoIndex = jsonResult.todos.findIndex((todo) => todo.id === args.id);

    if (todoIndex === -1) {
      return;
    }

    jsonResult.todos.splice(todoIndex, 1);
    await this.writeJson(jsonResult.todos);
  }

  public async deleteManyTodos(args: DeleteManyArgs): Promise<void> {
    const jsonResult: ReadJsonResult = await this.readJson();
    if (!jsonResult.success) {
      throw new HttpError({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error reading todos from path ${this.filePath}`,
      });
    }

    if ("clearAll" in args) {
      await this.writeJson([]);
      return;
    }

    const newTodos = jsonResult.todos.filter((todo) => !args.ids.includes(todo.id));
    await this.writeJson(newTodos);
  }
}

export const database = new Database();