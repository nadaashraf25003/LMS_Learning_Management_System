import { useTheme } from "../../../utils/ThemeProvider";
import { Moon, Sun } from "lucide-react";
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div
      className={`fixed bottom-20 right-5 p-2 rounded-full cursor-pointer select-none ${
        theme === "dark"
          ? "bg-zinc-800 text-[#fafafa]"
          : "bg-white text-[#3f3f3f]"
      } z-50`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </div>
  );
};
export default ThemeToggle;
