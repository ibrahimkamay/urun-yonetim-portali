import { UserResponseDTO } from "./userResponse";

export class AuthResponseDTO {
  token: string;
  user: UserResponseDTO;

  constructor(data: any) {
    this.token = data.token;
    this.user = new UserResponseDTO(data.user);
  }
}