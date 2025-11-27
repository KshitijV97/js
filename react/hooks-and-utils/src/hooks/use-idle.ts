import React from "react";

export const useIdle = (delay: number): boolean => {
  const [isIdle, setIsIdle] = React.useState(false);

  const timeoutId = React.useRef<number>(0);

  const startTimer = () => {
    timeoutId.current = setTimeout(goInactive, delay);
  };

  const resetTimer = () => {
    clearTimeout(timeoutId.current);

    goActive();
  };

  const goInactive = () => setIsIdle(true);

  const goActive = () => {
    setIsIdle(false);
    startTimer();
  };

  const setup = () => {
    [
      "mousemove",
      "mousedown",
      "keypress",
      "DOMMouseScroll",
      "mousewheel",
      "touchmove",
      "MSPointerMove",
      "focus",
    ].forEach((event) => document.addEventListener(event, resetTimer, false));

    document.addEventListener("blur", startTimer, false);
  };

  const cleanup = () => {
    [
      "mousemove",
      "mousedown",
      "keypress",
      "DOMMouseScroll",
      "mousewheel",
      "touchmove",
      "MSPointerMove",
      "focus",
    ].forEach((event) =>
      document.removeEventListener(event, resetTimer, false)
    );

    document.removeEventListener("blur", startTimer, false);

    clearTimeout(timeoutId.current);
  };

  React.useEffect(() => {
    setup();
    return () => {
      cleanup();
    };
  });

  return isIdle;
};
