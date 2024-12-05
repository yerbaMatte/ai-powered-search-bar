"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.scss";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = new URLSearchParams(useSearchParams().toString());

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setInputValue(query);
    }
  }, []);

  const handleInputChange = useCallback(
    debounce((value: string) => {
      if (!value) {
        searchParams.delete("query");
        router.push("/");
      } else {
        searchParams.set("query", value);
        router.push(`?${searchParams.toString()}`);
      }
    }, 1000),
    []
  );

  return (
    <div className={styles.input_wrapper}>
      <input
        type="text"
        value={inputValue}
        aria-autocomplete="list"
        aria-controls="suggestions"
        onChange={(e) => {
          const value = e.target.value;
          setInputValue(value);
          handleInputChange(value);
        }}
        placeholder="Search..."
        className={styles.input}
      />
    </div>
  );
};

function debounce(
  func: (value: string) => void,
  delay: number
): (value: string) => void {
  let timer: ReturnType<typeof setTimeout>;

  return function (value: string) {
    clearTimeout(timer);
    timer = setTimeout(() => func(value), delay);
  };
}

export default SearchBar;
