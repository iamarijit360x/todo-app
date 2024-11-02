import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './schemas/user.schema';

@ObjectType() // This decorator indicates that this class is a GraphQL object type
export class AuthPayload {
  @Field() // This decorator makes the field accessible in GraphQL queries
  token: string;

  @Field(() => User) // This decorator specifies the type of the field
  user: User; // Assuming User is another GraphQL ObjectType defined elsewhere
}
