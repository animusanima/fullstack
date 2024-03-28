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
          <label for="completedCheckbox_${todo.id}">Completed: ${todo.completed ? "yes" : "no"}</label>        
        </div>
        <footer class="card-footer">
          <button id="editButton_${todo.id}" class="button is-info card-footer-item" title="Edit existing todo">Edit</button>
        </footer>
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