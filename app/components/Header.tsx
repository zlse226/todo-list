import headerLogo from "../../public/images/Size=Large@2x.png";
import headerLogoSmall from "../../public/images/Size=Small.svg";
import styles from "./Header.module.css";

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