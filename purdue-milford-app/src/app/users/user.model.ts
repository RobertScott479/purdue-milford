export interface ConfirmationDialogInterface {
  title: string;
  content: string;
  returnVal: any;
  noButtonName?: string;
  yesButtonName?: string;
}

export interface ILoginUser {
  username: string;
  password: string;
}
