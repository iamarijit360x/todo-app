import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema()
export class Task extends Document {
  @Field(() => ID)
  _id: string; // This field is used as the GraphQL ID type

  @Field() // Add this line to expose the title in GraphQL
  @Prop({ required: true })
  title: string;

  @Field({ nullable: true }) // Add this line to expose the description in GraphQL
  @Prop()
  description?: string;

  @Field() // Add this line to expose the completed status in GraphQL
  @Prop({ default: false })
  completed: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
