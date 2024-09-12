import { useState, useEffect, useRef } from "react";

export const useInactivity = () => {
  const [userInactivity, setUserInactivity] = useState(false);
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setUserInactivity(false);
    localStorage.setItem("lastActivity", Date.now().toString());
    timeoutRef.current = setTimeout(() => {
      setUserInactivity(true);
    }, 1000 * 60 * 30);
  };

  useEffect(() => {
    const activityEvents = [
      "click",
      "scroll",
      "keydown",
      "mousemove",
      "mousedown",
      "touchstart",
    ];

    const handleActivity = () => {
      resetTimer();
    };

    const checkInactivity = () => {
      const lastActivity = localStorage.getItem("lastActivity");
      if (lastActivity) {
        const inactiveTime = Date.now() - parseInt(lastActivity);
        if (inactiveTime > 1000 * 60 * 30) {
          setUserInactivity(true);
        } else {
          setUserInactivity(false);
        }
      }
    };

    resetTimer();

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    window.addEventListener("storage", (e) => {
      if (e.key === "lastActivity") {
        checkInactivity();
      }
    });

    const intervalId = setInterval(checkInactivity, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearInterval(intervalId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      window.removeEventListener("storage", checkInactivity);
    };
  }, []);

  return userInactivity;
};
