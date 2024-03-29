export function getElement<T extends HTMLElement>(query: string): T {
  const element = document.querySelector<T>(query);
  if (element === null) {
    throw new Error(`Element not found: ${query}`);
  }
  return element;
}

export const todoElements = {
  form: getElement<HTMLFormElement>("#todoForm"),
  todoTitle: getElement<HTMLInputElement>("#todoTitle"),
  createButton: getElement<HTMLButtonElement>("#createTodo"),
  unfinishedTodosArea: getElement<HTMLDivElement>("#unfinishedTodosArea"),
  completedTodosArea: getElement<HTMLDivElement>("#completedTodosArea"),
};