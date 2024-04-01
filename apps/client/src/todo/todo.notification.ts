import Toastify from "toastify-js";

const TODO_SAVED_SUCCESSFULLY = "Todo has been saved successfully";
const TODO_DELETED_SUCCESSFULLY = "Todo has been deleted successfully";
const TODOS_DELETED_SUCCESSFULLY = "Todos have been deleted successfully";

function showToast(message: string) {
  Toastify({
    text: message,
    duration: 4000,
    newWindow: false,
    close: true,
    gravity: "top",
    position: "right",
    oldestFirst: true,
    style: {
      background: "rgb(72, 199, 142)",
      color: "rgb(0, 0, 0)",
    },
  }).showToast();
}

function showSuccessNotification(): void {
  showToast(TODO_SAVED_SUCCESSFULLY);
}

function showDeletedNotification(many: boolean): void {
  if (many) {
    showToast(TODOS_DELETED_SUCCESSFULLY);
  } else {
    showToast(TODO_DELETED_SUCCESSFULLY);
  }
}

export const NotificationHelper = {
  showSuccessNotification,
  showDeletedNotification,
};