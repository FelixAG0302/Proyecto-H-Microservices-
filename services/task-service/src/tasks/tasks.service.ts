import { Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {LessThanOrEqual, Repository} from 'typeorm';
import { Task, TaskType} from '../tasks/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepo: Repository<Task>,
    )
    {}

    async create(userId: string, dto: CreateTaskDto) : Promise<Task> {
        const task = this.tasksRepo.create({
            ...dto,
            userId,
        });
        return this.tasksRepo.save(task);
    }

    async findAllByUser(userId: string) : Promise<Task[]> {
        return this.tasksRepo.find({
                where: {userId},
                order: {createdAt: 'DESC'},
            })
    }

    async findDailyByUser(userId: string) : Promise<Task[]>{
        return this.tasksRepo.find({
            where: {userId, type: TaskType.DAILY},
            order: {createdAt: 'DESC'},
        })
    }

    async findScheduledByUser(userId: string, date: string) : Promise<Task[]>{
        return this.tasksRepo.find({
            where: {userId, type: TaskType.SCHEDULED, scheduledDate: date},
            order: {createdAt: 'ASC'},
        })
    }

    async findScheduledUntilDate( userId: string, date: string) : Promise<Task[]>{
        return this.tasksRepo.find({
            where: {
                userId,
                type: TaskType.SCHEDULED,
                isCompleted: false,
                scheduledDate: LessThanOrEqual(date),
            },
            order: {scheduledDate: 'ASC', startTime: 'ASC'}
        });
    }

    async update(id: string, userId: string, dto: UpdateTaskDto) : Promise<Task> {
        const task = await this.tasksRepo.findOne({ where: {id, userId}})

        if (!task) throw new NotFoundException('task not found')

        Object.assign(task, dto);
        return this.tasksRepo.save(task);
    }

    async remove(id: string, userId: string) : Promise<void> {
        const task = await this.tasksRepo.findOne({where: {id, userId}});

        if (!task) throw new NotFoundException('task not found');

        await this.tasksRepo.remove(task);
    }
}
