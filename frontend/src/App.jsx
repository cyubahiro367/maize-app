import { useState } from "react";
import "./styles/App.css";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import UploadScreen from "./components/UploadScreen";
import ResultScreen from "./components/ResultScreen";
import HistoryScreen from "./components/HistoryScreen";
import AboutScreen from "./components/AboutScreen";
import OfflineBanner from "./components/OfflineBanner";

import { useTranslation } from "./i18n";
import { useLocalHistory } from "./hooks/useLocalHistory";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { fileToThumbnail } from "./imageUtils";

const LANG_STORAGE_KEY = "maizedx_lang";

export default function App() {
  const [lang, setLang] = useState(
    () => localStorage.getItem(LANG_STORAGE_KEY) || "en"
  );
  const [screen, setScreen] = useState("home"); // home | result | history | about
  const [activeResult, setActiveResult] = useState(null); // { result, imagePreview, filename, historyId }

  const t = useTranslation(lang);
  const isOnline = useOnlineStatus();
  const { entries, addEntry, clearHistory } = useLocalHistory();

  function handleLangChange(code) {
    setLang(code);
    localStorage.setItem(LANG_STORAGE_KEY, code);
  }

  function handleResult(result, imagePreview, filename) {
    setActiveResult({ result, imagePreview, filename, historyId: null });
    setScreen("result");
  }

  async function handleSaveResult() {
    if (!activeResult) return;
    let thumbnail = null;
    try {
      // We only have the object URL / filename here; re-derive a persistent
      // thumbnail so the entry survives a reload (see imageUtils.js).
      if (activeResult.imagePreview) {
        const blob = await fetch(activeResult.imagePreview).then((r) => r.blob());
        thumbnail = await fileToThumbnail(blob);
      }
    } catch {
      // Non-fatal — save the entry without a thumbnail rather than losing it.
    }

    addEntry({
      predicted_class: activeResult.result.predicted_class,
      confidence: activeResult.result.confidence,
      translations: activeResult.result.translations,
      imagePreview: thumbnail,
    });
  }

  function handleSelectHistoryEntry(entry) {
    setActiveResult({
      result: {
        predicted_class: entry.predicted_class,
        confidence: entry.confidence,
        translations: entry.translations,
        needs_verification: false,
      },
      imagePreview: entry.imagePreview,
      filename: null,
      historyId: entry.id,
    });
    setScreen("result");
  }

  function handleBackToUpload() {
    setActiveResult(null);
    setScreen("home");
  }

  function handleNavigate(target) {
    if (target === "home") {
      setActiveResult(null);
    }
    setScreen(target);
  }

  return (
    <div className="app-shell">
      <Header t={t} lang={lang} onLangChange={handleLangChange} />
      {!isOnline && <OfflineBanner t={t} />}

      <main className="app-main">
        {screen === "home" && (
          <UploadScreen t={t} lang={lang} onResult={handleResult} isOnline={isOnline} />
        )}

        {screen === "result" && activeResult && (
          <ResultScreen
            t={t}
            lang={lang}
            result={activeResult.result}
            imagePreview={activeResult.imagePreview}
            filename={activeResult.filename}
            onBack={handleBackToUpload}
            onSave={handleSaveResult}
            alreadySaved={Boolean(activeResult.historyId)}
          />
        )}

        {screen === "history" && (
          <HistoryScreen
            t={t}
            lang={lang}
            entries={entries}
            onSelect={handleSelectHistoryEntry}
            onClear={clearHistory}
          />
        )}

        {screen === "about" && <AboutScreen t={t} />}
      </main>

      <BottomNav t={t} screen={screen === "result" ? "home" : screen} onNavigate={handleNavigate} />
    </div>
  );
}