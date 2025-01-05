import {TaskPriority} from "./TaskPriority";

export interface Task {
  id: number;
  name: string;
  type: string;
  done: string;
  priority: TaskPriority;
  created: Date;

  updated: Date;

  description: string;
}
