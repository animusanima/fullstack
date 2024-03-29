import { elements } from "./elements.ts";

const TODO_SAVED_SUCCESSFULLY = "Todo has been saved successfully";
const TODO_DELETED_SUCCESSFULLY = "Todo has been deleted successfully";

function setNotificationText(textToShow: string): void {
  elements.notificationText.textContent = textToShow;
}

function showSuccessNotification(): void {
  setNotificationText(TODO_SAVED_SUCCESSFULLY);
  elements.notification.className = "notification is-success";
  elements.notificationArea.removeAttribute("class");
}

function showDeletedNotification(): void {
  setNotificationText(TODO_DELETED_SUCCESSFULLY);
  elements.notification.className = "notification is-danger";
  elements.notificationArea.removeAttribute("class");
}

export const NotificationHelper = {
  showSuccessNotification,
  showDeletedNotification,
};

function initClickEvents(): void {
  elements.closeNotificationButton.addEventListener("click", () => {
    elements.notificationArea.setAttribute("class", "is-hidden");
  });
}

initClickEvents();