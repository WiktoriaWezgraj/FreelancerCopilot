export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button className="theme-toggle" type="button" onClick={onToggle}>
      <span className="theme-toggle-icon">{isDark ? "☾" : "☀"}</span>
      <span>{isDark ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}