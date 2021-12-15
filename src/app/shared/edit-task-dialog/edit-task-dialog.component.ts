import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITaskBucket, TaskBucketsFirebaseService } from 'src/app/services/task-buckets.firebase.service';
import {
  ITask,
  TasksFirebaseService,
} from 'src/app/services/tasks.firebase.service';
import { TaskPriority, TaskStatus } from 'src/shared/enum';

export interface TaskData {
  id: string;
}

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css'],
})
export class EditTaskDialogComponent implements OnInit {
  _task: ITask | undefined;

  public get task() {
    return this._task!;
  }

  public set task(val: ITask) {
    this.taskForm.get('title')?.setValue(val.title);
    this.taskForm.get('status')?.setValue(val.status);
    if (val.dueDate instanceof Date) {
      this.taskForm.get('dueDate')?.setValue(val.dueDate);
    }
    this.taskForm.get('priority')?.setValue(val.priority);
    this._task = val;
  }

  taskForm: FormGroup;
  taskPriorities = [
    { value: TaskPriority.Highest, key: 'Highest' },
    { value: TaskPriority.High, key: 'High' },
    { value: TaskPriority.Medium, key: 'Medium' },
    { value: TaskPriority.Low, key: 'Low' },
  ];
  taskStatuses = [
    { value: TaskStatus.Done, key: 'Done' },
    { value: TaskStatus.ToDo, key: 'To Do' },
  ];
  taskBuckets!: ITaskBucket[];

  constructor(
    public _dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskData,
    private _taskService: TasksFirebaseService,
    private _bucketService: TaskBucketsFirebaseService,
    private _formBuilder: FormBuilder
  ) {
    this.taskForm = this._formBuilder.group({
      id: [this.data.id],
      title: ['', [Validators.required]],
      status: ['', [Validators.required]],
      dueDate: [undefined],
      priority: [undefined],
      bucket: [''],
    });
  }

  async ngOnInit() {
    this.task = (await this._taskService.getTaskById(this.data.id)) as ITask;
    this.taskBuckets = (await this._bucketService.getTaskBuckets()) as ITaskBucket[];
  }

  cancelTaskUpdate(): void {
    this._dialogRef.close();
  }

  async saveTask() {
    this.task = { ...this.task, ...this.taskForm.value };
    this.task.dueDate = this.taskForm.get('dueDate')!.value;
    await this._taskService.updateTask(this.task as ITask);
    this._dialogRef.close(this.task);
  }
}
