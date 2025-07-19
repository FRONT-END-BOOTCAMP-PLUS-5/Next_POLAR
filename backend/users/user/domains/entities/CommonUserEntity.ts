// 공통 사용자 엔티티
export class CommonUserEntity {
  constructor(
    public readonly id: string, // 사용자 고유 ID (UUID)
    public phoneNumber: string, // 전화번호
    public password: string, // 비밀번호
    public email: string, // 이메일
    public age: number, // 나이
    public profileImgUrl: string, // 프로필 이미지 URL
    public address: string, // 주소
    public name: string, // 이름
    public nickname: string, // 닉네임 (nickname 컬럼)
    public readonly createdAt: Date // 생성일시 (수정 불가능)
  ) { }

  toJSON() {
    return {
      id: this.id,
      phoneNumber: this.phoneNumber,
      password: this.password,
      email: this.email,
      age: this.age,
      profile_img_url: this.profileImgUrl,
      address: this.address,
      name: this.name,
      nickname: this.nickname,
      createdAt: this.createdAt
    };
  }
}
