import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

type UserUpdate = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: number;
  institute?: string;
  university?: string;
  [key: string]: any;
};

export default async function updateUser(uid: string, data: UserUpdate): Promise<Record<string, any>> {
  if (!uid) throw new Error('updateUser: uid is required');
  if (!data || Object.keys(data).length === 0) return {};

  const userRef = doc(db, 'users', uid);
  console.log('updateUser called', { uid, data });

  try {
    await updateDoc(userRef, data);
  } catch (err: any) {
    console.warn('updateDoc failed, falling back to setDoc with merge:', err?.message || err);
    try {
      await setDoc(userRef, data, { merge: true });
    } catch (err2) {
      console.error('setDoc also failed', err2);
      throw err2; // rethrow so caller sees the error
    }
  }

  const snap = await getDoc(userRef);
  if (!snap.exists()) return {};
  const result = snap.data() as Record<string, any>;
  console.log('updateUser result', result);
  return result;
}