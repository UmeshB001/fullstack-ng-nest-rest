import { Module } from '@nestjs/common'; // Import the Module decorator from NestJS to define a module that encapsulates related components (e.g., controllers, services) for task management
import { TasksService } from './tasks.service'; // Import the TasksService to handle business logic related to tasks (e.g., creating, fetching, updating, deleting tasks)
import { TasksController } from './tasks.controller'; // Import the TasksController to handle task-related routes (e.g., /tasks, /tasks/:id)
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule to interact with MongoDB
import { TaskSchema } from './tasks.schema'; // Import the Task schema so we can register it with Mongoose and interact with the tasks collection in MongoDB

@Module({
  imports: [
    // Import the MongooseModule and register the Task schema so we can interact with the tasks collection in MongoDB
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
  ],
  controllers: [TasksController], // Register the TasksController to handle task-related routes (e.g., /tasks, /tasks/:id)
  providers: [TasksService], // Register the TasksService to handle business logic related to tasks (e.g., creating, fetching, updating, deleting tasks)
})
export class TasksModule {} // The TasksModule is a NestJS module that encapsulates all the components related to task management, including the controller, service, and Mongoose schema for tasks. It imports the necessary modules and registers the components so they can work together to provide the functionality for managing tasks in the application.
