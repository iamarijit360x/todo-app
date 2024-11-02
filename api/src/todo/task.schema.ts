import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@ObjectType()
@Schema()
export class Task extends Document {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: mongoose.Types.ObjectId, required: true }) // Specify the type explicitly
  createdBy: mongoose.Types.ObjectId; // This will store the ID of the user who created the task
}

export const TaskSchema = SchemaFactory.createForClass(Task);
