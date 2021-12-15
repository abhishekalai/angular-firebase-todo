import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITaskBucket, TaskBucketsFirebaseService } from 'src/app/services/task-buckets.firebase.service';
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
  taskBuckets!: ITaskBucket[];

  @Input() filter!: 'completed'|'upcoming'|'myday'|'bucket';
  private bucketId: string|undefined;

  constructor(
    private _tasks: TasksFirebaseService,
    private _bucketService: TaskBucketsFirebaseService,
    private _route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    if (this.filter === 'bucket') {
      this.bucketId = this._route.snapshot.params.id;
      this.bucketId = this._route.snapshot.paramMap.get('id') as string;
    }

    if (this.filter === 'completed') {
      this.tasks$ = await this._tasks.getCompletedTasks()
    } else if (this.filter === 'upcoming') {
      this.tasks$ = await this._tasks.getNearDueTasks();
    } else if (this.filter === 'bucket') {
      this.tasks$ = await this._tasks.getBucketTasks(this.bucketId as string);
    } else {
      this.tasks$ = await this._tasks.getTasks();
    }
    console.log(this.tasks$);
    this.taskBuckets = (await this._bucketService.getTaskBuckets()) as ITaskBucket[];
  }

  deleted(id: string) {
    this.tasks$ = this.tasks$.filter(tk => tk.id != id);
  }

  updated(_id: string) {
    // Reload the task list
    this.ngOnInit();
  }
}
