import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class User extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({required: true })
  name: string;

  @Field()
  @Prop({ unique: true, required: true })
  email: string;

  @Field()
  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
