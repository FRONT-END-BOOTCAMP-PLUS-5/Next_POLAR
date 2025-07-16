export class LoginResponseDTO {
  constructor(
    public accessToken: string,
    public refreshToken: string,
    public nickname: string,
    public role: string
  ) {}
}
