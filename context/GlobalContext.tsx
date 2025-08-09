"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface GlobalContextProps {
  isMobile: boolean;
  // Add more global states here as needed
}

const GlobalContext = createContext<GlobalContextProps>({
  isMobile: false,
});

export function useGlobal() {
  return useContext(GlobalContext);
}

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <GlobalContext.Provider value={{ isMobile }}>
      {children}
    </GlobalContext.Provider>
  );
}
