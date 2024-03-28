import { type Todo } from "@repo/shared";

function createLayoutForTodo(todos: Todo[]): HTMLDivElement {
  const containerDiv = document.createElement("div");
  containerDiv.className = "fixed-grid";
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
          <input id="completedCheckbox_${todo.id}" type="checkbox" value="${todo.completed}">        
        </div>      
      </div>                      
      `,
    );
    todoDiv.appendChild(card);
  }

  containerDiv.appendChild(todoDiv);
  return containerDiv;
}

export const layoutHelper = {
  createLayoutForTodo,
};