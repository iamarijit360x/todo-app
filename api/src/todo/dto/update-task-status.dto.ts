// src/task/dto/update-task-status.dto.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateTaskStatusInput {

  @Field()
  completed: boolean;
}
