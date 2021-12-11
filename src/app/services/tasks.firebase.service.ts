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
} from '@angular/fire/firestore';
import { CollectionNames, TaskStatus } from 'src/shared/enum';
import { FirebaseAuthService } from './firebase-auth.service';

export interface ITask extends DocumentData {
  id?: string;
  title: string;
  createdBy: string;
  status: TaskStatus;

  description?: string;
  dueDate?: Date;
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

  async getTasks() {
    const q = query(
      this.collectionRef,
      where('createdBy', '==', this._firebaseAuthService.userId),
      where('status', '==', TaskStatus.ToDo),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id };
    });
  }

  addTask(taskPayload: ITask) {
    return addDoc(this.collectionRef, taskPayload);
  }

  deleteTask(id: string) {
    const toDelete = doc(this._firestore, this.collectionName, id);
    return deleteDoc(toDelete);
  }

  updateTask(payload: ITask) {
    const toUpdate = doc(this._firestore, this.collectionName, payload.id as string);
    return updateDoc(toUpdate, payload);
  }
}
