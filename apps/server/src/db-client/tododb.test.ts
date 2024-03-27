import { afterAll, beforeAll, expect, test } from "vitest";
import path from "node:path";
import { promises as fs } from "fs";
import { Database } from "$/db-client/tododb";
import { type DeleteArgs, type DeleteManyArgs, type FindUniqueArgs, type UpdateArgs } from "$/db-client/api.types";
import { type Todo } from "shared";

const TEST_FILE_PATH = "./store.test.json";
const database = new Database(TEST_FILE_PATH);

async function resetTestFile(): Promise<void> {
  const filePath = path.join(__dirname, TEST_FILE_PATH);
  await fs.writeFile(filePath, JSON.stringify([]), "utf-8");
};

beforeAll(resetTestFile);
afterAll(resetTestFile);

test("creating a todo will store it in database", async () => {
  const todo = await database.create({ title: "new Todo", completed: false });
  expect(todo.title).toBe("new Todo");
  expect(todo).toHaveProperty("completed", false);
});

test("Finding unique todo from database", async () => {
  await database.create({ title: "new Todo", completed: false });
  const todo = await database.create({ title: "another Todo", completed: true });
  await database.create({ title: "yet another Todo", completed: true });
  const uniqueArgs: FindUniqueArgs = {
    id: todo.id,
  };

  const foundTodo = await database.findUnique(uniqueArgs);

  expect(foundTodo?.title).toBe("another Todo");
  expect(foundTodo).toHaveProperty("completed", true);
});

test("Updating existing todo with new title", async () => {
  const todo = await database.create({ title: "nwe Todo", completed: false });

  const updateArgs: UpdateArgs = {
    id: todo.id,
    data: {
      title: "New Todo",
      completed: true,
    },
  };

  const updatedTodo = await database.update(updateArgs);

  expect(updatedTodo?.title).toBe("New Todo");
  expect(updatedTodo?.completed).toBeTruthy();
});

test("Updating a non-existing todo will return undefined", async () => {
  await database.create({ title: "nwe Todo", completed: false });
  const updateArgs: UpdateArgs = {
    id: "123456",
    data: {
      title: "New Todo",
      completed: true,
    },
  };

  const updatedTodo = await database.update(updateArgs);

  expect(updatedTodo).toBeUndefined();
});

test("Deleting an existing todo will remove it from database", async () => {
  const todo = await database.create({ title: "new Todo", completed: false });

  const deleteArgs: DeleteArgs = {
    id: todo.id,
  };
  const deleted = await database.deleteTodo(deleteArgs);
  expect(deleted).toBeTruthy();
});

test("Deleting a non-existing todo will do nothing and return false", async () => {
  await database.create({ title: "new Todo", completed: false });

  const deleteArgs: DeleteArgs = {
    id: "1234567",
  };
  const deleted = await database.deleteTodo(deleteArgs);
  expect(deleted).toBeFalsy();
});

test("Deleting many with clearAll wipes database", async () => {
  const todos: Todo[] = [];
  todos.push(await database.create({ title: "new Todo", completed: false }));
  todos.push(await database.create({ title: "another Todo", completed: false }));
  todos.push(await database.create({ title: "the last Todo", completed: false }));

  await database.deleteManyTodos({ clearAll: true });

  let searchedTodo = await database.findUnique({
    id: todos[0].id,
  });
  expect(searchedTodo).toBeUndefined();

  searchedTodo = await database.findUnique({
    id: todos[1].id,
  });
  expect(searchedTodo).toBeUndefined();

  searchedTodo = await database.findUnique({
    id: todos[2].id,
  });
  expect(searchedTodo).toBeUndefined();
});

test("Deleting many with existing ids will remove entries from database", async () => {
  const todos: Todo[] = [];
  todos.push(await database.create({ title: "new Todo", completed: false }));
  todos.push(await database.create({ title: "another Todo", completed: false }));
  todos.push(await database.create({ title: "the last Todo", completed: false }));

  const deleteManyArgs: DeleteManyArgs = {
    ids: [
      todos[0].id,
      todos[1].id,
    ],
  };

  await database.deleteManyTodos(deleteManyArgs);
  let searchedTodo = await database.findUnique({
    id: todos[0].id,
  });
  expect(searchedTodo).toBeUndefined();

  searchedTodo = await database.findUnique({
    id: todos[1].id,
  });
  expect(searchedTodo).toBeUndefined();

  searchedTodo = await database.findUnique({
    id: todos[2].id,
  });
  expect(searchedTodo).toStrictEqual(todos[2]);
});