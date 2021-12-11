import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ITask, TasksFirebaseService } from 'src/app/services/tasks.firebase.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {}

}
