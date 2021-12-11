import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ITask, TasksFirebaseService } from 'src/app/services/tasks.firebase.service';
import { TaskStatus } from 'src/shared/enum';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.css']
})
export class TaskListItemComponent implements OnInit {
  @Input() taskItem!: ITask;
  mouseEntered = false;

  @Output() itemDeleted = new EventEmitter();
  @Output() itemUpdated = new EventEmitter();

  constructor(
    private _tasks: TasksFirebaseService
  ) { }

  ngOnInit(): void {}

  markAsDone() {
    this.taskItem.status = TaskStatus.Done;
    this._tasks.updateTask(this.taskItem);
    this.itemUpdated.emit(this.taskItem.id);
  }

  deleteTask() {
    this._tasks.deleteTask(this.taskItem.id as string);
    this.itemDeleted.emit(this.taskItem.id);
  }
}
