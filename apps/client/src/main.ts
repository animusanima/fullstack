import { api } from "./utils/api.ts";
import { type CreateTodoInput, type Todo } from "@repo/shared";
import { elements } from "./utils/elements.ts";
import { layoutHelper } from "./utils/todo.layout.ts";

let todos: Todo[];

// TODO: Implement updating todos

// TODO: Implement deletion todos

// TODO: Implement deletion of many todos

// TODO: Implement moving unfinished todos to completed list

function showAllTodos(): void {
  elements.unfinishedTodosArea.innerHTML = "";
  const containerDiv = layoutHelper.createLayoutForTodo(todos);
  elements.unfinishedTodosArea.appendChild(containerDiv);
}

async function getAllTodos(): Promise<void> {
  todos = [];

  const receivedTodos = await api.getAllTodos();
  for (const todo of receivedTodos) {
    todos.push({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
    });
  }

  showAllTodos();
}

async function createTodo(): Promise<void> {
  const todoTitle = elements.todoTitle.value;

  const todo: CreateTodoInput = {
    title: todoTitle.toString(),
    completed: false,
  };

  const newTodo = await api.createTodo(todo);
  todos.push(newTodo);

  void (() => elements.todoTitle.value = "")();

  showAllTodos();
}

elements.form.onsubmit = async (e): Promise<void> => {
  e.preventDefault();

  if (e.submitter instanceof HTMLButtonElement) {
    if (e.submitter.id === "showTodos") {
      showAllTodos();
    } else if (e.submitter.id === "createTodo") {
      await createTodo();
    }
  }
};

void getAllTodos();