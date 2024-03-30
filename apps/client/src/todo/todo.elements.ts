export function getElement<T extends HTMLElement>(query: string): T {
  const element = document.querySelector<T>(query);
  if (element === null) {
    throw new Error(`Element not found: ${query}`);
  }
  return element;
}

export const todoElements = {
  todoTitle: getElement<HTMLInputElement>("#todoTitle"),
  createButton: getElement<HTMLButtonElement>("#createTodo"),
  unfinishedTodosArea: getElement<HTMLDivElement>("#unfinishedTodosArea"),
  completedTodosArea: getElement<HTMLDivElement>("#completedTodosArea"),
  editTodoForm: getElement<HTMLDivElement>("#editTodoForm"),
  editTodoTitle: getElement<HTMLParagraphElement>("#editTodoTitle"),
  completeTodoCheckbox: getElement<HTMLInputElement>("#completeTodoCheckbox"),
  saveTodoButton: getElement<HTMLButtonElement>("#saveTodoButton"),
  cancelTodoButton: getElement<HTMLButtonElement>("#cancelTodoButton"),
  deleteCompletedButton: getElement<HTMLButtonElement>("#deleteCompletedButton"),
  deleteUnfinishedButton: getElement<HTMLButtonElement>("#deleteUnfinishedButton"),
};