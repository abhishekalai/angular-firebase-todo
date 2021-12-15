import { Injectable } from '@angular/core';
import {
  Firestore,
  CollectionReference,
  collection,
  DocumentData,
  deleteDoc,
  addDoc,
  doc,
  where,
  query,
  updateDoc,
  getDocs,
  QueryConstraint,
  orderBy,
} from '@angular/fire/firestore';
import { getDoc } from 'firebase/firestore';
import { CollectionNames, TaskStatus } from 'src/shared/enum';
import { FirebaseAuthService } from './firebase-auth.service';

export interface ITask extends DocumentData {
  id?: string;
  title: string;
  createdBy: string;
  status: TaskStatus;

  priority?: number;
  dueDate?: number|Date;
  createdAt?: Date;
  bucket?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TasksFirebaseService {
  private collectionRef: CollectionReference<ITask>;
  private collectionName = CollectionNames.tasks;

  constructor(
    private _firestore: Firestore,
    private _firebaseAuthService: FirebaseAuthService
  ) {
    this.collectionRef = collection(
      _firestore,
      this.collectionName
    ) as CollectionReference<ITask>;
  }

  async getTasks(additionalQueries: QueryConstraint[] = []) {
    const q = additionalQueries ? query(
        this.collectionRef,
        where('createdBy', '==', this._firebaseAuthService.userId),
        where('status', '==', TaskStatus.ToDo),
        orderBy('priority', 'asc'),
        ...additionalQueries,
      ) : query(
        this.collectionRef,
        where('createdBy', '==', this._firebaseAuthService.userId),
        where('status', '==', TaskStatus.ToDo),
        orderBy('priority', 'asc'),
      );
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id };
    });
    return tasks.map(tk => {
      if (tk.dueDate) {
        tk.dueDate = new Date(tk.dueDate);
      }
      return tk;
    })
  }

  async getCompletedTasks(additionalQueries: QueryConstraint[] = []) {
    const q = additionalQueries ? query(
        this.collectionRef,
        where('createdBy', '==', this._firebaseAuthService.userId),
        where('status', '==', TaskStatus.Done),
        orderBy('priority', 'asc'),
        ...additionalQueries,
      ) : query(
        this.collectionRef,
        where('createdBy', '==', this._firebaseAuthService.userId),
        where('status', '==', TaskStatus.Done),
        orderBy('priority', 'asc'),
      );
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id };
    });
    return tasks.map(tk => {
      if (tk.dueDate) {
        tk.dueDate = new Date(tk.dueDate);
      }
      return tk;
    })
  }

  async getTaskById(id: string) {
    const toGet = doc(this._firestore, this.collectionName, id);
    const taskData = (await getDoc(toGet)).data();
    if (taskData!.dueDate) {
      taskData!.dueDate = new Date(taskData!.dueDate);
    }
    return taskData;
  }

  addTask(taskPayload: ITask) {
    if (typeof taskPayload.dueDate === 'string') {
      taskPayload.dueDate = new Date(taskPayload.dueDate);
      taskPayload.dueDate = taskPayload.dueDate.getTime();
    }
    return addDoc(this.collectionRef, taskPayload);
  }

  deleteTask(id: string) {
    const toDelete = doc(this._firestore, this.collectionName, id);
    return deleteDoc(toDelete);
  }

  updateTask(payload: ITask) {
    const toUpdate = doc(this._firestore, this.collectionName, payload.id as string);
    if (payload.dueDate) {
      payload.dueDate = (payload.dueDate as Date).getTime();
    }
    return updateDoc(toUpdate, payload);
  }

  getPastDueTasks() {
    const currentDate = new Date();
    return this.getTasks([
      where('dueDate', '<', currentDate),
    ]);
  }

  async getBucketTasks(id: string) {
    const q = query(
      this.collectionRef,
      where('createdBy', '==', this._firebaseAuthService.userId),
      where('bucket', '==', id),
      orderBy('priority', 'asc'),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id };
    });
  }

  async getNearDueTasks() {
    const currentDate = new Date();
    const q = query(
      this.collectionRef,
      where('createdBy', '==', this._firebaseAuthService.userId),
      where('status', '==', TaskStatus.ToDo),
      where('dueDate', '>', currentDate),
      where('dueDate', '<', currentDate.setDate(currentDate.getDate() + 2)),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id };
    });
  }
}
