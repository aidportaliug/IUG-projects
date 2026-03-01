import { Timestamp } from 'firebase/firestore';

export interface PlasticProject {
  id: string;
  title: string;
  country: string;
  year: number;
  plasticType: string;
  product: string;
  processing: string;
  financing: string;
  businessModel: string;
  partnershipOwnership: string;
  wasteCollected: number;
}
