import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './tasks.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  // Use @InjectModel to get access to the MongoDB collection
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto) {
    const createdTask = new this.taskModel(createTaskDto);
    return await createdTask.save();
  }

  async findAll() {
    return await this.taskModel.find().exec();
  }

  findOne(id: string) {
    return `This action returns a #${id} task`;
  }

  search(query: string) {
    return this.taskModel
      .find({ title: { $regex: query, $options: 'i' } }) // Case-insensitive search
      .exec();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.taskModel.findByIdAndDelete(id).exec();
  }
}
