import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ITaskBucket } from 'src/app/services/task-buckets.firebase.service';
import { ITask, TasksFirebaseService } from 'src/app/services/tasks.firebase.service';
import { EditTaskDialogComponent } from 'src/app/shared/edit-task-dialog/edit-task-dialog.component';
import { TaskPriority, TaskStatus } from 'src/shared/enum';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.css']
})
export class TaskListItemComponent implements OnInit {
  @Input() taskItem!: ITask;
  @Input() filter!: 'myday'|'completed'|'upcoming'|'bucket';
  @Input() taskBuckets!: ITaskBucket[];
  mouseEntered = false;

  @Output() itemDeleted = new EventEmitter();
  @Output() itemUpdated = new EventEmitter();

  taskPriorityStyle = {
    [`${TaskPriority.Highest}`]: 'pr-highest',
    [`${TaskPriority.High}`]: 'pr-high',
    [`${TaskPriority.Medium}`]: 'pr-medium',
    [`${TaskPriority.Low}`]: 'pr-low',
  };

  _TaskStatus = TaskStatus;

  constructor(
    private _tasks: TasksFirebaseService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {}

  getPriorityText(pr: number|undefined) {
    if (typeof pr !== 'number') {
      return null;
    }
    switch (pr) {
      case 0:
        return 'Highest';
      case 1:
        return 'High';
      case 2:
        return 'Medium';
      case 3:
        return 'Low';
      default:
        return null;
    }
  }

  markAsDone() {
    this.taskItem.status = TaskStatus.Done;
    this._tasks.updateTask(this.taskItem);
    this.itemUpdated.emit(this.taskItem.id);
  }

  markAsToDo() {
    this.taskItem.status = TaskStatus.ToDo;
    this._tasks.updateTask(this.taskItem);
    this.itemUpdated.emit(this.taskItem.id);
  }

  deleteTask() {
    this._tasks.deleteTask(this.taskItem.id as string);
    this.itemDeleted.emit(this.taskItem.id);
  }

  openEditDialog(taskId: string) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '400px',
      data: { id: taskId },
    });

    dialogRef.afterClosed().subscribe(taskData => {
      if (!taskData) return;

      this.taskItem = taskData;
      this.itemUpdated.emit(this.taskItem.id);
    });
  }

  getBucketName(id: string) {
    return this.taskBuckets?.length ? this.taskBuckets.find(o => o.id === id)?.title : 'Loading ...';
  }
}
