document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal")).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".create-todo-modal")).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll(".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button")).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();

      const elements = document.getElementsByClassName("button is-danger");
      if (elements !== null && elements.length > 0) {
        for (const element of elements) {
          if (element instanceof HTMLButtonElement) {
            if (element.style.display !== "none" && element.textContent === "Cancel") {
              element.click();
              return;
            }
          }
        }
      }
    } else if (event.altKey && event.key === "n") {
      const modalDlg = document.getElementById("createTodoModal");
      openModal(modalDlg);
    } else if (event.key === "Enter") {
      const createButton = document.getElementById("createTodo");
      if (createButton !== null) {
        if (createButton instanceof HTMLButtonElement) {
          if (createButton.style.display !== "none")
            createButton.click();
        }
      }
    } else if (event.altKey && event.key === "s") {
      const saveButton = document.getElementById("saveTodoButton");
      if (saveButton !== null) {
        if (saveButton instanceof HTMLButtonElement) {
          if (saveButton.style.display !== "none")
            saveButton.click();
        }
      }
    }
  });
});