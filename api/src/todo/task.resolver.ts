import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task } from './task.entity'; // Import the GraphQL entity
import { CreateTaskInput } from './dto/create-task.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UpdateTaskInput } from './dto/update-task.dto';
import { UpdateTaskStatusInput } from './dto/update-task-status.dto';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard) // Apply the guard to protect this mutation
  @Mutation(() => Task)
  async createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
    @Context() context: any, // Access context to get the request
  ): Promise<Task> {
    const user = context.req.user; // Access user info from the request context
    console.log(user); // Optionally log user info

    // Pass user ID to the service along with the task input
    return this.taskService.create(createTaskInput, user.sub); // Adjust based on how user ID is accessed
  }

  @UseGuards(JwtAuthGuard) // Protect this query as well
  @Query(() => [Task], { name: 'tasks' })
  async findAll(@Context() context: any): Promise<Task[]> {
    const user = context.req.user; // Access user info from the request context
    return this.taskService.findAll(user.sub); // Use user ID to filter tasks if needed
  }

  @UseGuards(JwtAuthGuard) // Protect this query as well
  @Query(() => Task, { name: 'task' })
  async findOne(@Args('id') id: string, @Context() context: any): Promise<Task> {
    const user = context.req.user; // Optionally access user info if needed
    return this.taskService.findOne(id, user.sub); // Pass user ID if necessary for authorization
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Task)
  async updateTask(
    @Args('id') id: string,
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
    @Context() context: any,
  ): Promise<Task> {
    const user = context.req.user; // Access user info
    return this.taskService.update(id, updateTaskInput, user.sub); // Pass user ID for any additional checks
  }

  @UseGuards(JwtAuthGuard) // Protect this mutation as well
  @Mutation(() => Task)
  async removeTask(@Args('id') id: string, @Context() context: any): Promise<Task> {
    const user = context.req.user; // Access user info
    return this.taskService.remove(id, user.sub); // Pass user ID for additional checks
  }


  @UseGuards(JwtAuthGuard)
  @Mutation(() => Task)
  async updateStatus(
    @Args('id') id: string, // Ensure this ID matches your GraphQL schema expectations
    @Args('updateTaskStatusInput') updateTaskStatusInput: UpdateTaskStatusInput, // Make sure the input structure is correct
    @Context() context: any,
  ): Promise<Task> {
    const user = context.req.user; // Access user info
    // Call the service method with the provided ID and input
    console.log(id, updateTaskStatusInput, user.sub)
    return this.taskService.updateStatus(id, updateTaskStatusInput, user.sub); // Pass user ID for any additional checks
  }
  

}
