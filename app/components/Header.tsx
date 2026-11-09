import headerLogo from "../../public/images/Size=Large@2x.png";
import headerLogoSmall from "../../public/images/Size=Small.svg";
import styles from "./Header.module.css";

// 목록과 상세 페이지에 표시하며, 로고 클릭 시 목록을 새로 불러오는 헤더
export default function Header() {
  return (
    <header className={styles.header}>
      <a className={styles.headerInner} href="/" aria-label="홈으로 이동">
        <img className={styles.headerLogo} src={headerLogo.src} alt="" />
        <img className={styles.headerLogoSmall} src={headerLogoSmall.src} alt="" />
      </a>
    </header>
  );
}