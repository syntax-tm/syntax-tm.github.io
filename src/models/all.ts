import { EventType } from "@src/app/enums";

export interface IAction {
  type: EventType;
  payload?: unknown;
}

