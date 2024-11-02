import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import TodoModule from './todo/task.module';
TodoModule
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot( process.env.DATABASE_URL),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // Auto-generate schema
      playground: true, // Enables GraphQL Playground for testing
    }),
    AuthModule,
    TodoModule,
  ],
})
export class AppModule {}

