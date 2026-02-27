import { PartialType } from '@nestjs/mapped-types';
import { TaskPriority } from '../entities/task.entity';

export class UpdateTaskDto {
  priority: TaskPriority;
}
