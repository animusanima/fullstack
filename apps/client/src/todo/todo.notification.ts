import Toastify from "toastify-js";

const TODO_SAVED_SUCCESSFULLY = "Todo has been saved successfully";
const TODO_DELETED_SUCCESSFULLY = "Todo has been deleted successfully";

function showSuccessNotification(): void {
  Toastify({
    text: TODO_SAVED_SUCCESSFULLY,
    duration: 2500,
    newWindow: false,
    close: false,
    gravity: "top",
    position: "center",
    oldestFirst: true,
    style: {
      background: "rgb(72, 199, 142)",
      color: "rgb(0, 0, 0)",
    },
  }).showToast();
}

function showDeletedNotification(): void {
  Toastify({
    text: TODO_DELETED_SUCCESSFULLY,
    duration: 2500,
    newWindow: false,
    close: false,
    gravity: "top",
    position: "center",
    oldestFirst: true,
    style: {
      background: "rgb(255, 102, 133)",
      color: "rgb(0, 0, 0)",
    },
  }).showToast();
}

export const NotificationHelper = {
  showSuccessNotification,
  showDeletedNotification,
};