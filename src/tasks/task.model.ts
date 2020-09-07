export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface ITaskModel {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export class TaskModel implements ITaskModel {
  description: string;
  id: string;
  status: TaskStatus;
  title: string;
}
