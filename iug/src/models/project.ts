import { GeoPoint } from "firebase/firestore";

export interface Project{
    id: string;
    title: string;
    location: GeoPoint;
    durationDays: number; //TODO: Days or credits?
    deadline: Date;
    field: string;
    description?: string;
    picture?: string;
    status: string;
    professorId: string;
}