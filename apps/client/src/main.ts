import { api } from "./utils/api.ts";
import { type CreateTodoInput, type Todo } from "@repo/shared";
import { elements } from "./elements.ts";

let todos: Todo[];

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

  elements.allTodosArea.innerHTML = "";
  for (const todo of todos) {
    const todoDiv = document.createElement("div");
    todoDiv.insertAdjacentHTML(
      "beforeend",
      `
      <h3>Todo ID: ${todo.id}</h3>
      <p>Todo title: ${todo.title}</p>
      <label for="completedCheckbox_${todo.id}">Completed:</label>
      <input id="completedCheckbox_${todo.id}" type="checkbox" value="${todo.completed}" disabled="disabled">
      `,
    );
    elements.allTodosArea.appendChild(todoDiv);
  }
}

async function createTodo(): Promise<void> {
  const todoTitle = elements.todoTitle.value;

  const todo: CreateTodoInput = {
    title: todoTitle.toString(),
    completed: false,
  };


  await api.createTodo(todo);
}

elements.queryButton.onclick = () => getAllTodos;
elements.form.onsubmit = async (e): Promise<void> => {
  e.preventDefault();

  if (e.submitter instanceof HTMLButtonElement) {
    if (e.submitter.id === "getAllTodos") {
      await getAllTodos();
    } else if (e.submitter.id === "createTodo") {
      await createTodo();
    }
  }
};