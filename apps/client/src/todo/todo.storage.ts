import type { CreateTodoInput, Todo, UpdateTodoInput } from "@repo/shared";
import { todoElements } from "./todo.elements.ts";
import { layoutHelper } from "./todo.layout.ts";
import { api } from "./todo.api.ts";
import { NotificationHelper } from "./todo.notification.ts";

const storedTodos: Todo[] = [];

const completedTodos: Todo[] = [];

function storeTodos(todos: Todo[]): void {
  storedTodos.push(...todos);
}

function storeCompletedTodos(todos: Todo[]): void {
  completedTodos.push(...todos);
}

function showAllTodos(): void {
  todoElements.unfinishedTodosArea.innerHTML = "";
  const unfinished = layoutHelper.createLayoutForTodo(storedTodos);
  todoElements.unfinishedTodosArea.appendChild(unfinished);

  todoElements.completedTodosArea.innerHTML = "";
  const completed = layoutHelper.createCompletedTodosLayout(completedTodos);
  todoElements.completedTodosArea.appendChild(completed);
}

export async function getAllTodos(): Promise<void> {
  const receivedTodos = await api.getAllTodos();

  const unfinishedTodos: Todo[] = receivedTodos.filter(element => !element.completed);
  const todosCompleted: Todo[] = receivedTodos.filter(element => element.completed);
  storeTodos(unfinishedTodos);
  storeCompletedTodos(todosCompleted);
  showAllTodos();
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

export async function deleteManyTodos(todos: Todo[]): Promise<void> {
  for (const todo of todos) {
    await api.deleteTodoById(todo.id);
  }

  NotificationHelper.showDeletedNotification();

  await getAllTodos();
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
    completedTodos.push(updatedTodo);
    storedTodos.splice(todoIndex, 1);
  }

  NotificationHelper.showSuccessNotification();
  showAllTodos();
}


export function getCompletedTodos(): Todo[] {
  return completedTodos;
}

export const storage = {
  createTodo,
  deleteTodo,
  deleteManyTodos,
  getAllTodos,
  updateTodo,
  getCompletedTodos,
};