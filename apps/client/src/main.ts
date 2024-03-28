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
  const containerDiv = document.createElement("div");
  containerDiv.className = "fixed-grid has-2-cols";
  const todoDiv = document.createElement("div");
  todoDiv.className = "grid";
  for (const todo of todos) {
    const card = document.createElement("div");
    card.insertAdjacentHTML(
      "beforeend",
      `      
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">${todo.title}</p>
        </header>
        <div class="card-content">
          <label for="completedCheckbox_${todo.id}">Completed:</label>
          <input id="completedCheckbox_${todo.id}" type="checkbox" value="${todo.completed}" disabled="disabled">        
        </div>      
      </div>                      
      `,
    );
    todoDiv.appendChild(card);
  }
  containerDiv.appendChild(todoDiv);
  elements.allTodosArea.appendChild(containerDiv);
}

async function createTodo(): Promise<void> {
  const todoTitle = elements.todoTitle.value;

  const todo: CreateTodoInput = {
    title: todoTitle.toString(),
    completed: false,
  };

  await api.createTodo(todo);

  void (() => elements.todoTitle.value = "")();
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