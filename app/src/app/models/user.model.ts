
export class User {
  id?: number;
  fullname?: string;
  email?: string;
  password?: string;
  phone?: string;

  constructor(data: any) {
    this.id = data.id;
    this.fullname = data.username;
    this.email = data.email;
    this.phone = data.phone;
  }
}