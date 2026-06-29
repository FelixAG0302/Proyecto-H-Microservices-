import { Controller, Get, Post, Delete, Put, Patch, Body, Param, Query, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(@Headers('x-user-id') userId: string, @Body() dto: CreateTaskDto) {
        return this.tasksService.create(userId, dto);
    }

    @Get()
    findAll(@Headers('x-user-id') userId: string){
        return this.tasksService.findAllByUser(userId);
    }

    @Get('daily')
    findAllDaily(@Headers('x-user-id') userId: string) {
        return this.tasksService.findDailyByUser(userId);
    }

        @Get('scheduled/untildate')
    findScheduledUntilDate(
        @Headers('x-user-id') userId: string,
        @Query('date') date: string,
    ){
        return this.tasksService.findScheduledUntilDate(userId, date)
    }
    
    @Get('Scheduled')
    findScheduled(@Headers('x-user-id') userId: string, @Query('date') date: string) {
        return this.tasksService.findScheduledByUser(userId, date);
    }

    @Patch(':id')
    update(
        @Headers('x-user-id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateTaskDto,
    ) {
        return this.tasksService.update(id, userId, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Headers('x-user-id') userId: string, @Param('id') id: string) {
        return this.tasksService.remove(id, userId);
    }
}
