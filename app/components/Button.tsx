import type { ComponentPropsWithoutRef } from "react";
import styles from "../components/Button.module.css";

type ButtonProps = ComponentPropsWithoutRef<"button">;

// 추가하기, 수정완료, 삭제하기에 공툥으로 사용하는 버튼
export default function Button({
  children,     // 버튼안에 들어갈 내용
  className = "",
  ...props      // 나머지 버튼 속성
}: ButtonProps) {
  return (
    <button className={`${styles.button} ${className}`} {...props}>
      {children}
    </button>
  );
}