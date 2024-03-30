import { todoElements } from "./todo/todo.elements.ts";
import { storage } from "./todo/todo.storage.ts";

todoElements.createButton.onclick = async (): Promise<void> => {
  await storage.createTodo(todoElements.todoTitle.value);
};

todoElements.deleteCompletedButton.onclick = async (): Promise<void> => {
  await storage.deleteManyTodos(storage.getCompletedTodos());
};

todoElements.deleteUnfinishedButton.onclick = async (): Promise<void> => {
  await storage.deleteManyTodos(storage.getUnfinishedTodos());
};

void storage.getAllTodos();