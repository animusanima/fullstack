import { promises as fs } from "fs";
import { type Todo, todoSchema } from "shared";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// TODO: Refactoring steps

const FILE_PATH = "./store.json";

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

async function readJson(): Promise<Todo[]> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const deserialzedData: unknown = JSON.parse(data);
    const schema = z.array(todoSchema);
    const parsedData = schema.parse(deserialzedData);
    return parsedData;
  } catch (error) {
    const notFoundError = z.object({
      code: z.literal("ENOENT"),
    }).safeParse(error);

    if (notFoundError.success) {
      console.error(`file not found ${FILE_PATH}`);
      return [];
    } else if (error instanceof SyntaxError) {
      console.error(`Invalid JSON at ${FILE_PATH}`);
      await fs.writeFile(FILE_PATH, JSON.stringify({}), "utf-8");
      return [];
    } else if (error instanceof z.ZodError) {
      console.error(`Invalid data at ${FILE_PATH}`);
      await fs.writeFile(FILE_PATH, JSON.stringify({}), "utf-8");
      return [];
    }
    console.error("Unknown error", error);
    return [];
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

  const storedTodos = await readJson();
  storedTodos.push(newTodo);

  await writeJson(storedTodos);
  return newTodo;
}

export async function findUnique(args: FindUniqueArgs): Promise<Todo | undefined> {
  const storedTodos = await readJson();

  return storedTodos.find((todo) => todo.id === args.id);
}

export async function update(args: UpdateArgs): Promise<Todo | undefined> {
  const storedTodos = await readJson();
  const todoIndex = storedTodos.findIndex((todo) => todo.id === args.id);
  if (todoIndex === -1) {
    return undefined;
  }

  const updatedTodo = {
    ...storedTodos[todoIndex],
    ...args.data,
  } satisfies Todo;

  storedTodos[todoIndex] = updatedTodo;
  await writeJson(storedTodos);

  return updatedTodo;
}

export async function deleteTodo(args: DeleteArgs): Promise<boolean> {
  const storedTodos = await readJson();
  const todoIndex = storedTodos.findIndex((todo) => todo.id === args.id);

  if (todoIndex === -1) {
    return false;
  }

  storedTodos.splice(todoIndex, 1);
  await writeJson(storedTodos);
  return true;
}

export async function deleteManyTodos(args: DeleteManyArgs): Promise<void> {
  if ("clearAll" in args) {
    await writeJson([]);
    return;
  }

  const storedTodo = await readJson();
  const newTodos = storedTodo.filter((todo) => args.ids.includes(todo.id));
  await writeJson(newTodos);
}

export const db = {
  create,
  findUnique,
  update,
  deleteTodo,
  deleteManyTodos,
};