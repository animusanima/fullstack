import { todoElements } from "./todo/todo.elements.ts";
import { storage } from "./todo/todo.storage.ts";

// TODO: Implement deletion of many todos

todoElements.createButton.onclick = async (): Promise<void> => {
  await storage.createTodo(todoElements.todoTitle.value);
};

void storage.getAllTodos();