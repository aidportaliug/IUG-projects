import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Project } from '../models/project';

export async function getProject(id: string): Promise<Project | null> {
  const projectDoc = doc(collection(db, 'project'), id);
  const projectSnap = await getDoc(projectDoc);
  if (!projectSnap.exists) {
    return null;
  }
  const project = projectSnap.data() as Project;
  project.id = projectSnap.id;
  return project;
}
