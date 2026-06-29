import { IsString, IsOptional, IsBoolean, ValidateIf, MinLength, Matches } from 'class-validator';
import { TaskType } from '../entities/task.entity';

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    title?: string;

    @IsOptional()
    @IsBoolean()
    IsCompleted?: boolean;

    @ValidateIf((o) => o.title === TaskType.SCHEDULED)
    @IsOptional()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime debe tener formato HH:MM',
    })
    StartTime?: string;

    @ValidateIf((o) => o.title === TaskType.SCHEDULED)
    @IsOptional()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime debe tener formato HH:MM',
    })
    EndTime?: string;

    @ValidateIf((o) => o.title === TaskType.SCHEDULED)
    @IsOptional()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'ScheduledDate debe tener formato HH:MM',
    })
    ScheduledDate?: string;





}