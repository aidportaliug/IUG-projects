/*
Type used for an standard and admin user
*/
export interface CustomUser {
  userID: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  institute?: string;
  university?: string;
  contributionIds?: Map<string, string>;
  professor: boolean;
}
