import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';
import { CreateTaskInput } from './dto/create-task.dto';
import { UpdateTaskStatusInput } from './dto/update-task-status.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskInput: CreateTaskInput, user: any): Promise<Task> {
    console.log("CREATED BY",user )
    const newTask = new this.taskModel({ 
      ...createTaskInput, 
      createdBy: user 
    });
    return newTask.save();
  }


  async findAll(user: any): Promise<Task[]> {
    return this.taskModel.find({ createdBy: user }).exec();
  }

  async findOne(id: string,user: any): Promise<Task> {
    return this.taskModel.findOne({_id:id, createdBy: user }).exec();
  }

  async update(id: string, updateTaskInput: Partial<CreateTaskInput>,user: any): Promise<Task> {
    return this.taskModel.findOneAndUpdate({_id:id, createdBy: user }, updateTaskInput, { new: true }).exec();
  }

  async remove(id: string,user: any): Promise<Task> {
    return this.taskModel.findOneAndDelete({_id:id, createdBy: user }).exec();
  }

  async updateStatus(id: string, UpdateTaskStatusInput: Partial<UpdateTaskStatusInput>,user: any): Promise<Task> {
    return this.taskModel.findOneAndUpdate({_id:id, createdBy: user }, UpdateTaskStatusInput, { new: true }).exec();
  }
}
