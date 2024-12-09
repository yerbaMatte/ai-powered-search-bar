import Image from "next/image";
import ThemeSwitcher from "../ThemeSwticher/ThemeSwitcher";
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <div className={styles.header}>
      <a
        href="https://github.com/yerbaMatte/search-bar-assignment"
        target="_blank"
        className={styles.anchor}
        aria-label="Get Code"
      >
        <Image
          src="/github.svg"
          alt="yerba mate drink"
          width={24}
          height={24}
          className={styles.github}
        />
        <span className="font-bold">Code here</span>
      </a>
      <ThemeSwitcher />
    </div>
  );
};

export default Header;
