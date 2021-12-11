import { Injectable } from '@angular/core';
import {
  DocumentData,
  CollectionReference,
  collection,
  Firestore,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { CollectionNames } from 'src/shared/enum';
import { FirebaseAuthService } from './firebase-auth.service';

export interface ITaskBucket extends DocumentData {
  id?: string;
  title: string;
  createdBy: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskBucketsFirebaseService {
  private collectionRef: CollectionReference<ITaskBucket>;
  private collectionName = CollectionNames.buckets;

  constructor(
    private _firestore: Firestore,
    private _firebaseAuthService: FirebaseAuthService
  ) {
    this.collectionRef = collection(
      _firestore,
      this.collectionName
    ) as CollectionReference<ITaskBucket>;
  }

  async getTaskBucketByName(title: string) {
    const q = query(
      this.collectionRef,
      where('createdBy', '==', this._firebaseAuthService.userId),
      where('title', '==', title)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  }

  async getTaskBuckets() {
    const q = query(
      this.collectionRef,
      where('createdBy', '==', this._firebaseAuthService.userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  }

  async addTaskBucket(title: string) {
    try {
      const buckets = await this.getTaskBucketByName(title);
      if (buckets.length) {
        throw new Error('A bucket with this name already exists!');
      }
      const taskPayload: ITaskBucket = {
        title,
        createdBy: this._firebaseAuthService.userId,
      };
      return addDoc(this.collectionRef, taskPayload);
    } catch (error) {
      throw error;
    }
  }

  deleteTaskBucket(id: string) {
    const toDelete = doc(this._firestore, this.collectionName, id);
    return deleteDoc(toDelete);
  }

  updateTask(payload: ITaskBucket) {
    const toUpdate = doc(
      this._firestore,
      this.collectionName,
      payload.id as string
    );
    return updateDoc(toUpdate, payload);
  }
}
