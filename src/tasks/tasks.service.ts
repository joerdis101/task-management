import { Injectable, NotFoundException } from '@nestjs/common';
import { ITaskModel, TaskModel, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: ITaskModel[] = [];

  getAllTasks(): ITaskModel[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): ITaskModel[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(task => task.title.includes(search) ||
      task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): ITaskModel {
    const foundTask = this.tasks.find(task => task.id === id);

    if (!foundTask) {
      throw new NotFoundException(`Task with '${id}' not found`)
    }
    return foundTask;
  }

  createTask(createTaskDto: CreateTaskDto): ITaskModel {
    const { title, description } = createTaskDto;

    const task = new TaskModel();
    task.description = description
    task.id = uuidv4()
    task.status = TaskStatus.OPEN
    task.title = title

    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    const foundTask = this.getTaskById(id);

    this.tasks = this.tasks.filter(task => task.id !== foundTask.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): ITaskModel {
    const task = this.getTaskById(id);

    task.status = status;
    return task;
  }
}
