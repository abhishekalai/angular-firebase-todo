import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { TasksFirebaseService } from 'src/app/services/tasks.firebase.service';
import { TaskStatus } from 'src/shared/enum';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css'],
})
export class NewTaskComponent implements OnInit {
  taskTitle = '';
  @Output() taskCreated = new EventEmitter();

  constructor(
    private _tasks: TasksFirebaseService,
    private _firebaseAuthService: FirebaseAuthService
  ) {}

  ngOnInit(): void {}

  async createNewTask() {
    await this._tasks.addTask({
      title: this.taskTitle,
      createdBy: this._firebaseAuthService.userId,
      status: TaskStatus.ToDo
    });
    this.taskTitle = '';
    this.taskCreated.emit('');
  }

  checkInput(ev: KeyboardEvent) {
    if (ev.key === 'Enter' && this.taskTitle.length >= 1) {
      this.createNewTask();
    }
  }
}
