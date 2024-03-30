import type { CreateTodoInput, Todo, UpdateTodoInput } from "@repo/shared";
import { todoElements } from "./todo.elements.ts";
import { layoutHelper } from "./todo.layout.ts";
import { api } from "./todo.api.ts";
import { NotificationHelper } from "./todo.notification.ts";

const storedTodos: Todo[] = [];

function showAllTodos(): void {
  todoElements.unfinishedTodosArea.innerHTML = "";
  const containerDiv = layoutHelper.createLayoutForTodo(storedTodos);
  todoElements.unfinishedTodosArea.appendChild(containerDiv);
}

function storeTodos(todos: Todo[]): void {
  storedTodos.push(...todos);
}

export function storeTodo(todo: Todo): void {
  storedTodos.push(todo);
}

export async function deleteTodo(todo: Todo): Promise<void> {
  await api.deleteTodoById(todo.id);

  const todoIndex = storedTodos.findIndex((element) => element.id === todo.id);
  storedTodos.splice(todoIndex, 1);

  NotificationHelper.showDeletedNotification();

  showAllTodos();
}

export async function createTodo(title: string): Promise<void> {
  if (title === undefined || title.trim() === "") {
    return;
  }

  const todo: CreateTodoInput = {
    title: title.toString(),
    completed: false,
  };

  const newTodo = await api.createTodo(todo);
  storeTodo(newTodo);

  NotificationHelper.showSuccessNotification();

  void (() => todoElements.todoTitle.value = "")();

  showAllTodos();
}

export async function updateTodo({ todoId, ...input }: UpdateTodoInput & { todoId: string }): Promise<void> {
  const updatedTodo = await api.updateTodo({ id: todoId, ...input });

  const todoIndex = storedTodos.findIndex((elements) => elements.id === todoId);
  if (todoIndex !== -1) {
    storedTodos[todoIndex] = updatedTodo;
  }

  NotificationHelper.showSuccessNotification();
  showAllTodos();
}

export async function getAllTodos(): Promise<void> {
  const receivedTodos = await api.getAllTodos();
  storeTodos(receivedTodos);
  showAllTodos();
}

export const storage = {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
};