import { afterAll, expect, test } from "vitest";
import { beforeEach } from "node:test";
import path from "node:path";
import { promises as fs } from "fs";
import { Database } from "$/db-client/tododb";

const TEST_FILE_PATH = "./store.test.json";
const database = new Database(TEST_FILE_PATH);

async function resetTestFile(): Promise<void> {
  const filePath = path.join(__dirname, TEST_FILE_PATH);
  await fs.writeFile(filePath, JSON.stringify([]), "utf-8");
};

beforeEach(resetTestFile);
afterAll(resetTestFile);

test("create a todo will add todo to list", async () => {
  const todo = await database.create({ title: "new Todo", completed: false });
  expect(todo.title).toBe("new Todo");
  expect(todo).toHaveProperty("completed", false);
});

// TODO: Challenge: Add Tests for remaining functionality