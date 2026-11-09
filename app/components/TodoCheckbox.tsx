import checkboxPrev from "../../public/images/ic/Property 1=Default.svg";
import checkboxDone from "../../public/images/ic/Property 1=Frame 2610233.svg";
import styles from "./TodoCheckbox.module.css";

type TodoCheckboxProps = {
  isCompleted: boolean; // 현재 완료 상태
  onToggle: () => void; // 버튼을 눌렀을 때 실행할 함수
  disabled?: boolean;   // 버튼을 잠글지 여부
};

// 목록과 상세에서 할 일의 완료 상태를 표시하고 변경하는 체크 버튼
export default function TodoCheckbox({
  isCompleted,
  onToggle,
  disabled = false,
}: TodoCheckboxProps) {
  return (
    <button
      className={styles.checkbox}
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={isCompleted ? "진행 중으로 변경" : "완료로 변경"}
    >
      {/* 완료 여부에 따라 아이콘 변경 */}
      <img src={isCompleted ? checkboxDone.src : checkboxPrev.src} alt="" />
    </button>
  );
}
