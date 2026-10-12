import { LeafIcon } from "./icons";
import { LANGUAGES } from "../i18n";

export default function Header({ t, lang, onLangChange }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <LeafIcon width={22} height={22} />
        <div>
          <h1>{t.appName}</h1>
          <p className="app-header__subtitle">{t.appSubtitle}</p>
        </div>
      </div>

      <div className="lang-switch" role="group" aria-label="Language">
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            aria-pressed={lang === code}
            onClick={() => onLangChange(code)}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
