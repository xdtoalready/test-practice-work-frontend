import { useEffect } from "react";

export const useBodyClassWhen = (condition, className) => {
  useEffect(() => {
    if (condition) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }

    return () => {
      document.body.classList.remove(className);
    };
  }, [condition, className]);
};
