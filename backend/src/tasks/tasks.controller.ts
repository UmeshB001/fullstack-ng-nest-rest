import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('tasks') // This decorator defines a controller that will handle routes starting with /tasks. It allows us to organize our route handlers related to tasks in one place.
@UseGuards(AuthGuard('jwt')) // Apply the JWT authentication guard to all routes in this controller, ensuring that only authenticated users can access the task-related endpoints. This guard will check for a valid JWT token in the request headers and authenticate the user before allowing access to any of the routes defined in this controller.
export class TasksController {
  constructor(private readonly tasksService: TasksService) {} // The constructor injects the TasksService, which contains the business logic for managing tasks (e.g., creating, fetching, updating, deleting tasks). This allows the controller to delegate the actual work to the service and keep the route handlers clean and focused on handling HTTP requests and responses.

  @Post() // This decorator defines a route handler for POST requests to /tasks. It allows us to create a new task by sending a POST request with the task data in the request body.
  @UseGuards(RolesGuard) // Apply the RolesGuard to this specific route, which will check the user's role (e.g., admin, user) before allowing access to this endpoint. This is an example of role-based access control, where only users with certain roles can perform specific actions (like creating a task). The RolesGuard will typically check the user's role from the JWT token and compare it against the required roles for this route, which can be defined using custom decorators or metadata.
  create(@Body() createTaskDto: CreateTaskDto) {
    // The @Body() decorator extracts the task data from the request body and maps it to a CreateTaskDto object, which is a Data Transfer Object that defines the structure of the expected data for creating a task. This allows us to validate and type-check the incoming data before passing it to the service for processing.
    return this.tasksService.create(createTaskDto); // Call the create method in the TasksService to handle the logic for creating a new task with the provided data. The service will typically interact with the database to save the new task and return the created task or a success response.
  }

  @Get() // This decorator defines a route handler for GET requests to /tasks. It allows us to fetch a list of all tasks by sending a GET request to this endpoint.
  findAll() {
    // Call the findAll method in the TasksService to handle the logic for fetching all tasks from the database. The service will typically query the database for all task documents and return them as a response to the client.
    return this.tasksService.findAll(); // Call the findAll method in the TasksService to handle the logic for fetching all tasks from the database. The service will typically query the database for all task documents and return them as a response to the client.
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
