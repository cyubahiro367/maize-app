import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "maizedx_history_v1";
const MAX_ENTRIES = 30;

function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeHistory(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage can throw in private-browsing/storage-full situations —
    // history becomes a nice-to-have, not a hard dependency, so we swallow this.
  }
}

export function useLocalHistory() {
  const [entries, setEntries] = useState(() => readHistory());

  useEffect(() => {
    writeHistory(entries);
  }, [entries]);

  const addEntry = useCallback((entry) => {
    setEntries((prev) => {
      const next = [
        { ...entry, id: `${Date.now()}`, savedAt: new Date().toISOString() },
        ...prev,
      ].slice(0, MAX_ENTRIES);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
  }, []);

  return { entries, addEntry, clearHistory };
}
