import { todoElements } from "./todo/todo.elements.ts";
import { storage } from "./todo/todo.storage.ts";

todoElements.createButton.onclick = async (): Promise<void> => {
  await storage.createTodo(todoElements.todoTitle.value);
};

todoElements.deleteCompletedModal.onclick = async (): Promise<void> => {
  const todosToDelete = storage.getCompletedTodos();
  if (todosToDelete.length > 0) {
    await storage.deleteManyTodos(todosToDelete);
  }
};

todoElements.deleteUnfinishedModal.onclick = async (): Promise<void> => {
  const todosToDelete = storage.getUnfinishedTodos();
  if (todosToDelete.length > 0) {
    await storage.deleteManyTodos(todosToDelete);
  }
};

void storage.getAllTodos();