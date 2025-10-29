import { doc, updateDoc, setDoc, getDocs, query, collection, where, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

type UserUpdate = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: number;
  institute?: string;
  university?: string;
  [key: string]: any;
};

/**
 * Updates the user profile document in Firestore based on their userID field.
 * Falls back to setDoc with merge if updateDoc fails.
 */
export default async function updateUser(uid: string, data: UserUpdate): Promise<Record<string, any>> {
  if (!uid) throw new Error('updateUser: uid is required');
  if (!data || Object.keys(data).length === 0) return {};

  try {
    // First find the document in "userProfile" that matches this uid
    const q = query(collection(db, 'userProfile'), where('userID', '==', uid));
    const snap = await getDocs(q);

    if (snap.empty) {
      throw new Error(`No userProfile found for uid: ${uid}`);
    }

    const docRef = snap.docs[0].ref; // assuming 1 document per user

    // Try updating first
    try {
      await updateDoc(docRef, data);
    } catch (err) {
      console.warn('updateDoc failed, falling back to setDoc with merge:', err);
      await setDoc(docRef, data, { merge: true });
    }

    // Return the updated data
    const updatedSnap = await getDoc(docRef);
    return updatedSnap.data() as Record<string, any>;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}