import { elements } from "./utils/elements.ts";
import { storage } from "./utils/todo.storage.ts";

// TODO: Implement updating todos

// TODO: Implement deletion of many todos

// TODO: Implement moving unfinished todos to completed list

elements.form.onsubmit = async (e): Promise<void> => {
  e.preventDefault();

  if (e.submitter instanceof HTMLButtonElement) {
    if (e.submitter.id === "createTodo") {
      await storage.createTodo(elements.todoTitle.value);
    }
  }
};

void storage.getAllTodos();