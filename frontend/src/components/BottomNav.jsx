import { HomeIcon, HistoryIcon, InfoIcon } from "./icons";

const ITEMS = [
  { key: "home", Icon: HomeIcon, labelKey: "nav_home" },
  { key: "history", Icon: HistoryIcon, labelKey: "nav_history" },
  { key: "about", Icon: InfoIcon, labelKey: "nav_about" },
];

export default function BottomNav({ t, screen, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {ITEMS.map(({ key, Icon, labelKey }) => (
        <button
          key={key}
          type="button"
          className="bottom-nav__item"
          aria-current={screen === key ? "page" : undefined}
          onClick={() => onNavigate(key)}
        >
          <Icon />
          <span>{t[labelKey]}</span>
        </button>
      ))}
    </nav>
  );
}
