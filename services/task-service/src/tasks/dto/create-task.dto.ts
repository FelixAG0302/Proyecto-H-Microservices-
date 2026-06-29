import {
    IsString,
    IsEnum,
    IsOptional,
    IsBoolean,
    MinLength,
    ValidateIf,
    Matches,
} from 'class-validator';
import { TaskType } from '../entities/task.entity';

export class CreateTaskDto {
    @IsString()
    @MinLength(3)
    title!: string;

    @IsEnum(TaskType)
    type!: TaskType;

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;

    @ValidateIf((o) => o.type === TaskType.SCHEDULED)
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'startTime debe tener formato HH:MM',
    })
    startTime?: string;

    @ValidateIf((o) => o.type === TaskType.SCHEDULED)
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'endTime debe tener formato HH:MM',
    })
    endTime?: string;

    @ValidateIf((o) => o.type === TaskType.SCHEDULED)
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'scheduledDate debe tener formato YYYY-MM-DD',
    })
    scheduledDate?: string;
}