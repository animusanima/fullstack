import type { Todo } from "@repo/shared";

export type ReadJsonResult = {
  success: true;
  todos: Todo[]
} | {
  success: false;
  error: Error
};

export type CreateArgs = Omit<Todo, "id">;

export type FindUniqueArgs = {
  id: Todo["id"];
}

export type UpdateArgs = {
  id: Todo["id"];
  data: Partial<Omit<Todo, "id">>;
}

export type DeleteArgs = {
  id: Todo["id"];
}

export type DeleteManyArgs = {
  ids: Array<Todo["id"]>
} | { clearAll: true };