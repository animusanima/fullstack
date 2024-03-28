import { api } from "./utils/api.ts";
import { type CreateTodoInput, Todo } from "@repo/shared";
import { elements } from "./utils/elements.ts";
import { storage } from "./utils/todo.storage.ts";

// TODO: Implement updating todos

// TODO: Implement deletion todos

// TODO: Implement deletion of many todos

// TODO: Implement moving unfinished todos to completed list

async function getAllTodos(): Promise<void> {
  const loadedTodos: Todo[] = [];
  const receivedTodos = await api.getAllTodos();
  for (const todo of receivedTodos) {
    loadedTodos.push({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
    });
  }
  storage.storeTodos(loadedTodos);
  storage.showAllTodos();
}

async function createTodo(): Promise<void> {
  const todoTitle = elements.todoTitle.value;

  const todo: CreateTodoInput = {
    title: todoTitle.toString(),
    completed: false,
  };

  const newTodo = await api.createTodo(todo);
  storage.storeTodo(newTodo);

  void (() => elements.todoTitle.value = "")();

  storage.showAllTodos();
}

elements.form.onsubmit = async (e): Promise<void> => {
  e.preventDefault();

  if (e.submitter instanceof HTMLButtonElement) {
    if (e.submitter.id === "showTodos") {
      storage.showAllTodos();
    } else if (e.submitter.id === "createTodo") {
      await createTodo();
    }
  }
};

void getAllTodos();