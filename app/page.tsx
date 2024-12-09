import SearchBar from "@/components/ui/SearchBar/SearchBar";
import styles from "./page.module.scss";

const page = () => {
  return (
    <section className={styles.container}>
      <SearchBar />
    </section>
  );
};

export default page;
