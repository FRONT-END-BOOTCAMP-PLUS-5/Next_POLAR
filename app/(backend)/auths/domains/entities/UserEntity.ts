// 사용자 도메인 엔티티
export interface UserData {
  id: string;
  email: string;
  password: string;
  age: number;
  profile_url: string;
  address: string;
  user_type: "Junior" | "Senior" | "Admin";
  star_point: number;
  help_id: number; // FK
  review_id: number; // FK
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

// 사용자 생성 팩토리
export class UserFactory {
  static create(
    email: string,
    password: string,
    age: number,
    address: string,
    user_type: "Junior" | "Senior" | "Admin",
    profile_url: string = ""
  ): UserData {
    return {
      id: crypto.randomUUID(),
      email,
      password, // 실제로는 해시된 비밀번호가 들어감
      age,
      profile_url,
      address,
      user_type,
      star_point: 0,
      help_id: 0,
      review_id: 0,
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true
    };
  }

  // 사용자 유효성 검사
  static validate(user: UserData): boolean {
    return !!(
      user.email &&
      user.email.includes('@') &&
      user.password &&
      user.password.length >= 6 &&
      user.age >= 0 &&
      user.address &&
      user.user_type
    );
  }

  // 이메일 형식 검사
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 비밀번호 강도 검사
  static isStrongPassword(password: string): boolean {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  }

  // 사용자 비활성화
  static deactivate(user: UserData): UserData {
    return {
      ...user,
      is_active: false,
      updated_at: new Date()
    };
  }

  // 사용자 활성화
  static activate(user: UserData): UserData {
    return {
      ...user,
      is_active: true,
      updated_at: new Date()
    };
  }

  // 별점 업데이트
  static updateStarPoint(user: UserData, newStarPoint: number): UserData {
    return {
      ...user,
      star_point: Math.max(0, newStarPoint), // 음수 방지
      updated_at: new Date()
    };
  }
} 