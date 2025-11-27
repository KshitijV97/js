import React from "react";

export const usePageVisits = (pageName: string) => {
  const storageKey = `pageVisits_${pageName}`;

  const [visitCount, setVisitCount] = React.useState<number>(() => {
    try {
      const storedCount = localStorage.getItem(storageKey);
      return storedCount ? parseInt(storedCount, 10) : 0;
    } catch (error) {
      console.error("Failed to access localStorage", error);
      return 0;
    }
  });

  React.useEffect(() => {
    setVisitCount((prevCount) => {
      const newCount = prevCount + 1;
      try {
        localStorage.setItem(storageKey, newCount.toString());
      } catch (error) {
        console.error("Failed to update", error);
      }
      return newCount;
    });
  }, [storageKey]);

  return { visitCount };
};
