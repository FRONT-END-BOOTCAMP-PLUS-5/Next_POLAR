"use client";
import styles from "./_styles/login.module.css";
import Image from "next/image";
import Logo from "@/public/images/logos/POLAR.png";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";

interface loginData {
  emailOrPhone: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<loginData>();

  const loginSubmitHandler: SubmitHandler<loginData> = (data) => {
    alert(`${data.emailOrPhone} / ${data.password}`);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoContainer}>
        <Image src={Logo} alt="POLAR" />
      </div>

      <p>POLAR 로그인</p>

      <form
        className={styles.formContainer}
        onSubmit={handleSubmit(loginSubmitHandler)}
      >
        <div className={styles.inputContainer}>
          <label htmlFor="loginId">이메일 / 전화번호</label>
          <input
            type="text"
            id="loginId"
            className={styles.commonInput}
            {...register("emailOrPhone")}
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            className={styles.commonInput}
            {...register("password")}
          />
        </div>
        <button type="submit" className={styles.commonButton}>
          로그인
        </button>
        <div className={styles.subMenuContainer}>
          {/* 회원가입, 비밀번호 찾기, 개인정보처리방침 링크, 추후 구현  */}
          <Link href={"/sign-up"}>회원가입</Link>
          <span>|</span>
          <Link href={"/find-password"}>비밀번호 찾기</Link>
          <span>|</span>
          <Link href={"/find-id"}>개인정보처리방침</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
