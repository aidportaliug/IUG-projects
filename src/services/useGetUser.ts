import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { CustomUser } from '../models/user';

export const useGetUser = async (userID: string): Promise<CustomUser | null> => {
  const queryGetUser: CollectionReference<DocumentData> = collection(db, 'userProfile');
  const q = query(queryGetUser, where('userID', '==', userID));
  const userProfileSnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
  if (userProfileSnapshot.size !== 1) {
    return null;
  }
  let userData: CustomUser | null = null;
  userProfileSnapshot.forEach((doc) => {
    userData = doc.data() as CustomUser;
  });
  return userData;
};
