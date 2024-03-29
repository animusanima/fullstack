import { elements, getElement } from "./elements.ts";

const TODO_SAVED_SUCCESSFULLY = "Todo has been saved successfully";
const TODO_DELETED_SUCCESSFULLY = "Todo has been deleted successfully";

function setNotificationText(textToShow: string): void {
  const notificationText = getElement<HTMLParagraphElement>("#notificationText");
  notificationText.textContent = textToShow;
}

function showSuccessNotification(): void {
  const notification = getElement<HTMLDivElement>("#notification");
  notification.className = "notification is-success";

  const notificationArea = getElement<HTMLDivElement>("#notificationArea");
  setNotificationText(TODO_SAVED_SUCCESSFULLY);
  notificationArea.removeAttribute("class");
}

function showDeletedNotification(): void {
  const notification = getElement<HTMLDivElement>("#notification");
  notification.className = "notification is-danger";

  const notificationArea = getElement<HTMLDivElement>("#notificationArea");
  setNotificationText(TODO_DELETED_SUCCESSFULLY);
  notificationArea.removeAttribute("class");
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