
export interface UserInterface {
  username: string;
  password: string;
  type: string;
}

export interface UserResInterface {
  errorCode: string;
  errorMessage: string;
  users: UserInterface[];
}
