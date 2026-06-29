import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TaskType {
    DAILY = 'daily',
    SCHEDULED = 'scheduled',
}

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    userId!: string;

    @Column()
    title!: string;

    @Column({ type: 'enum', enum: TaskType, default: TaskType.DAILY})
    type!: TaskType;

    @Column({ type: 'time', nullable: true })
    startTime!: string | null;

    @Column({ type: 'time', nullable: true })
    endTime!: string | null;

    @Column({ type: 'date', nullable: true })
    scheduledDate!: string | null;

    @Column({default: false})
    isCompleted!: boolean

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}