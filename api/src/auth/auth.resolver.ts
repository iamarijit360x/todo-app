import { Resolver, Mutation, Args, Query, ObjectType, Field } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard'; // Adjust path as necessary
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';

@ObjectType()
class AuthPayload {
  @Field()
  token: string;

  @Field(() => User) // Assuming User is defined in user.entity
  user: User;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
  @Mutation(() => User)
  async signup(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.authService.register(createUserInput.name,createUserInput.email,createUserInput.password);
  }

  @Mutation(() => AuthPayload)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ) :Promise<AuthPayload>{
    const user = await this.authService.validateUser(loginUserInput.email, loginUserInput.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const payload=await this.authService.login(user);
    console.log(payload)
    return payload;
  }
  @UseGuards(JwtAuthGuard) // Protect this resolver with the guard
  @Mutation(() => String)
  async protectedMethod(
    @Args('someInput') someInput: string,
  ): Promise<string> {
    // This method is protected and requires a valid JWT token
    return `You have accessed a protected route with input: ${someInput}`;
  }
}
