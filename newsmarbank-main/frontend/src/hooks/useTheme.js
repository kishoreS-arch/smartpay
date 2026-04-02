import { useMode } from "../context/ModeContext";

const useTheme = () => {
  const { currentMode, switchMode } = useMode();

  return { 
    theme: currentMode, 
    setTheme: switchMode, 
    setNormal: () => switchMode("normal"), 
    setSenior: () => switchMode("senior"), 
    setVisual: () => switchMode("visual") 
  };
};

export default useTheme;
