import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ITask, TasksFirebaseService } from 'src/app/services/tasks.firebase.service';

@Component({
  selector: 'app-upcoming-tasks',
  templateUrl: './upcoming-tasks.component.html',
  styleUrls: ['./upcoming-tasks.component.css']
})
export class UpcomingTasksComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {}

}
