import { type Todo, type UpdateTodoInput } from "@repo/shared";
import { storage } from "./todo.storage.ts";
import { todoElements } from "./todo.elements.ts";

let editID: string | null = null;

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
    editButton.id = todo.id;
    editButton.className = "button is-info card-footer-item";
    editButton.title = "Edit todo";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      editID = editButton.id;
      todoElements.completeTodoCheckbox.checked = todo.completed;
      todoElements.editTodoTitle.textContent = `Edit Todo ${todo.title}`;
      todoElements.editTodoForm.classList.remove("is-hidden");
    });

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

todoElements.editTodoForm.onsubmit = async (e): Promise<void> => {
  e.preventDefault();

  let hideForm: boolean = false;

  if (e.submitter instanceof HTMLButtonElement) {
    if (e.submitter.id === "saveTodoButton") {
      const updateTodoInput: UpdateTodoInput = {
        completed: todoElements.completeTodoCheckbox.checked,
      };

      if (editID !== null) {
        await storage.updateTodo({ todoId: editID, ...updateTodoInput });
        hideForm = true;
      }
    } else if (e.submitter.id === "cancelTodoButton") {
      todoElements.editTodoTitle.textContent = "";
      todoElements.completeTodoCheckbox.checked = false;
      hideForm = true;
    }

    if (hideForm) {
      todoElements.editTodoForm.classList.add("is-hidden");
    }

    editID = null;
  }
};

todoElements.cancelTodoButton.onclick = () => {
  todoElements.editTodoForm.classList.add("is-hidden");
};