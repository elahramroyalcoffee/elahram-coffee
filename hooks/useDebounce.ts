import { useRef, useState } from "react";

export function useDebounce() {
  const timerId = useRef<NodeJS.Timeout | undefined>(undefined);
  const [debouncedValue, setDebouncedValue] = useState("");
  const handleSearch = async (e: any) => {
    e.preventDefault();
    const serchItem = e.currentTarget.value;
    const delay = 1500;
    clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      setDebouncedValue(serchItem); // necessary api calls
    }, delay);
  };
  return {
    debouncedValue,
    handleSearch,
  };
}
