import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'Password must be at least 6 characters long, contain a number and a special character.',
  })
  password: string;
}
