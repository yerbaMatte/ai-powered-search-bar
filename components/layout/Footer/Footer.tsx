import styles from "./Footer.module.scss";
import Image from "next/image";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <a
        href="https://www.blog.yerbamatte.com"
        target="_blank"
        className={styles.anchor}
      >
        <Image
          src="/mate.svg"
          alt="yerba mate drink"
          width={24}
          height={24}
          className={styles.mate}
        />
        <span className="font-bold"> blog.yerbamatte.com</span>
      </a>
    </div>
  );
};

export default Footer;
