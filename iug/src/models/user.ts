/*
Type used for an standard and admin user
*/
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  academicRole?: string;
  institute?: string;
  university: string;
  picture?: string;
  contributionIds?: Map<string,string>;
  role: string;
  phoneNumber?: string;
}