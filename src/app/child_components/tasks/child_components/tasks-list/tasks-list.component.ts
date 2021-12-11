import { Component, OnInit } from '@angular/core';
import { Query, QuerySnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ITask, TasksFirebaseService } from 'src/app/services/tasks.firebase.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  today = new Date();
  // tasks$!: Query<ITask>;
  tasks$!: ITask[];

  constructor(
    private _tasks: TasksFirebaseService
  ) {}

  ngOnInit(): void {
    this._tasks.getTasks().then(value => {
      this.tasks$ = value;
    });
  }

  deleted(id: string) {
    this.tasks$ = this.tasks$.filter(tk => tk.id != id);
  }

  updated(id: string) {
    this.tasks$ = this.tasks$.filter(tk => tk.id != id);
  }
}
