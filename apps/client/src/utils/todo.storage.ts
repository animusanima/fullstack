import type { Todo } from "@repo/shared";
import { elements } from "./elements.ts";
import { layoutHelper } from "./todo.layout.ts";
import { api } from "./api.ts";

const storedTodos: Todo[] = [];

export function showAllTodos(): void {
  elements.unfinishedTodosArea.innerHTML = "";
  const containerDiv = layoutHelper.createLayoutForTodo(storedTodos);
  elements.unfinishedTodosArea.appendChild(containerDiv);
}

export function storeTodos(todos: Todo[]): void {
  storedTodos.push(...todos);
}

export function storeTodo(todo: Todo): void {
  storedTodos.push(todo);
}

export async function removeTodo(todo: Todo): Promise<void> {
  await api.deleteTodoById(todo.id);

  const todoIndex = storedTodos.findIndex((element) => element.id === todo.id);
  storedTodos.splice(todoIndex, 1);
  showAllTodos();
}

export const storage = {
  storeTodos,
  storeTodo,
  removeTodo,
  showAllTodos,
};