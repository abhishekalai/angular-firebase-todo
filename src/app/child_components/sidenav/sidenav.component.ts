import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import {
  ITaskBucket,
  TaskBucketsFirebaseService,
} from 'src/app/services/task-buckets.firebase.service';

/** @title Responsive sidenav */
@Component({
  selector: 'app-sidenav',
  templateUrl: 'sidenav.component.html',
  styleUrls: ['sidenav.component.css'],
})
export class SidenavComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  taskBuckets!: ITaskBucket[];

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _buckets: TaskBucketsFirebaseService,
    private _snackBar: SnackbarService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    _buckets.getTaskBuckets().then(value => {
      this.taskBuckets = value;
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  async createNewBucket(bucketName: string) {
    try {
      await this._buckets.addTaskBucket(bucketName);
    } catch (error) {
      this._snackBar.openSnackBar((error as Error).message, 'Close');
    }
  }
}
