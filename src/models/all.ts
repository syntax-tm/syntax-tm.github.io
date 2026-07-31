import { EventType } from "@app/enums";

export interface IAction {
  type: EventType;
  payload?: unknown;
}

