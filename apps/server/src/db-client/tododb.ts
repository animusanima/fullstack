import { promises as fs } from "fs";
import { type Todo, todoSchema } from "shared";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// TODO: Refactoring steps

const FILE_PATH = "./store.json";

type ReadJsonResult = {
  success: true;
  todos: Todo[]
} | {
  success: false;
  error: Error
};

type CreateArgs = Omit<Todo, "id">;

type FindUniqueArgs = {
  id: Todo["id"];
}

type UpdateArgs = {
  id: Todo["id"];
  data: Partial<Omit<Todo, "id">>;
}

type DeleteArgs = {
  id: Todo["id"];
}

type DeleteManyArgs = {
  ids: Array<Todo["id"]>
} | { clearAll: true };

async function readJson(): Promise<ReadJsonResult> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const deserializedData: unknown = JSON.parse(data);
    const schema = z.array(todoSchema);
    const parsedData = schema.parse(deserializedData);
    return { success: true, todos: parsedData };
  } catch (error) {
    const notFoundError = z.object({
      code: z.literal("ENOENT"),
    }).safeParse(error);

    if (notFoundError.success) {
      return { success: false, error: new Error(`file not found ${FILE_PATH}`) };
    } else if (error instanceof SyntaxError) {
      await fs.writeFile(FILE_PATH, JSON.stringify({}), "utf-8");
      return { success: false, error: new Error(`Invalid JSON at ${FILE_PATH}`) };
    } else if (error instanceof z.ZodError) {
      await fs.writeFile(FILE_PATH, JSON.stringify({}), "utf-8");
      return { success: false, error: new Error(`Invalid data at ${FILE_PATH}`) };
    }
    return { success: false, error: error instanceof Error ? error : new Error("Unknown error") };
  }
}

async function writeJson(todos: Todo[]): Promise<void> {
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(todos), "utf-8");
  } catch (error) {
    console.log("Error writing file", error);
  }
}

export async function create(args: CreateArgs): Promise<Todo> {
  const newTodo = { ...args, id: uuidv4() } satisfies Todo;

  const jsonResult: ReadJsonResult = await readJson();
  if (!jsonResult.success) {
    throw new Error("Error reading todos");
  }

  jsonResult.todos.push(newTodo);
  await writeJson(jsonResult.todos);
  return newTodo;
}

export async function findUnique(args: FindUniqueArgs): Promise<Todo | undefined> {
  const jsonResult: ReadJsonResult = await readJson();

  if (!jsonResult.success) {
    throw new Error("Error reading todos");
  }

  return jsonResult.todos.find((todo) => todo.id === args.id);
}

export async function update(args: UpdateArgs): Promise<Todo | undefined> {
  const jsonResult: ReadJsonResult = await readJson();
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
  await writeJson(jsonResult.todos);

  return updatedTodo;
}

export async function deleteTodo(args: DeleteArgs): Promise<boolean> {
  const jsonResult: ReadJsonResult = await readJson();
  if (!jsonResult.success) {
    throw new Error("Error reading todos");
  }
  const todoIndex = jsonResult.todos.findIndex((todo) => todo.id === args.id);

  if (todoIndex === -1) {
    return false;
  }

  jsonResult.todos.splice(todoIndex, 1);
  await writeJson(jsonResult.todos);
  return true;
}

export async function deleteManyTodos(args: DeleteManyArgs): Promise<void> {
  if ("clearAll" in args) {
    await writeJson([]);
    return;
  }

  const jsonResult: ReadJsonResult = await readJson();
  if (!jsonResult.success) {
    throw new Error("Error reading todos");
  }
  const newTodos = jsonResult.todos.filter((todo) => args.ids.includes(todo.id));
  await writeJson(newTodos);
}

export const db = {
  create,
  findUnique,
  update,
  deleteTodo,
  deleteManyTodos,
};