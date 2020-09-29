import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserEntity } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(
    id: number,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const foundTask = await this.taskRepository.findOne({ where: { id, userId: user.id }});

    if (!foundTask) {
      throw new NotFoundException(`Task with '${id}' not found`)
    }
    return foundTask;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(
    id: number,
    user: UserEntity,
  ): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with '${id}' not found`)
    }
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await task.save();
    return task;
  }
}
