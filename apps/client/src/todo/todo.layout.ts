import { type Todo } from "@repo/shared";
import { storage } from "./todo.storage.ts";

function createLayoutForTodo(todos: Todo[]): HTMLDivElement {
  const containerGrid = document.createElement("div");
  containerGrid.className = "fixed-grid";
  const todoGrid = document.createElement("div");
  todoGrid.className = "grid";

  for (const todo of todos) {
    const cardContainer = document.createElement("div");
    const card = document.createElement("div");
    card.className = "card";

    const cardHeader = document.createElement("header");
    cardHeader.className = "card-header";

    const cardHeaderTitle = document.createElement("p");
    cardHeaderTitle.className = "card-header-title is-centered";
    cardHeaderTitle.textContent = todo.title;

    const cardContent = document.createElement("div");
    cardContent.className = "card-content";

    const completedLabel = document.createElement("label");
    completedLabel.textContent = `Completed: ${todo.completed ? "yes" : "no"}`;

    const cardFooter = document.createElement("footer");
    cardFooter.className = "card-footer";

    const editButton = document.createElement("button");
    editButton.className = "button is-info card-footer-item";
    editButton.title = "Edit todo";
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.className = "button is-danger card-footer-item";
    deleteButton.title = "Delete todo";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      void (async () => {
        await storage.deleteTodo(todo);
      })();
    });

    cardHeader.appendChild(cardHeaderTitle);
    cardContent.appendChild(completedLabel);
    cardFooter.appendChild(editButton);
    cardFooter.appendChild(deleteButton);

    card.appendChild(cardHeader);
    card.appendChild(cardContent);
    card.appendChild(cardFooter);

    cardContainer.appendChild(card);

    todoGrid.appendChild(cardContainer);
  }

  containerGrid.appendChild(todoGrid);
  return containerGrid;
}

export const layoutHelper = {
  createLayoutForTodo,
};