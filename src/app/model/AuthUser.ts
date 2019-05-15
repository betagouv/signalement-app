export class User {

  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;

}

export class AuthUser {
  token: string;
  user: User;
}
