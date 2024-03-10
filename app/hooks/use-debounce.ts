import { useEffect, useState } from "react";

export default function useDebounce(value: string, delay?: number) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebounceValue(value);
    }, delay || 500);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return debounceValue;
}
