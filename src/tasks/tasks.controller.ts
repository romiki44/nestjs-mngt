import { Controller, 
          Get, 
          Post, 
          Body, 
          Param, 
          Delete, 
          Patch, 
          Query, 
          UsePipes, 
          ValidationPipe
        } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto):Task[] {
    if(Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilter(filterDto);
    }
    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  // klasicky
  /*@Post()
  creteTask(
    @Body('title') title: string,
    @Body('description') description: string
  ): Task {
    return this.tasksService.createTask(title, description);
  }*/

  // Dto
  @Post()
  @UsePipes(ValidationPipe)
  creteTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id:string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }
}