// export interface UserInterface {
//   username: string;
//   password: string;
//   roles: UserRoleEnum[];
// }

export interface UserInterface {
  id?: number;
  firstName?: string;
  lastName?: string;
  username: string;
  jobTitle?: string;
  phone?: string;
  roles: string[];
  active?: number;
  password?: string;
}

export interface UsersInterface {
  users: UserInterface[];
}

export interface UserResInterface {
  // errorCode: string;
  // errorMessage: string;
  user: UserInterface;
}

export enum UserRoleEnum {
  Admin = 'Admin',
  Super = 'Super',
  User = 'User',
  Anon = 'Anon',
  Unknown = '',
}
