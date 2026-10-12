import { ImageEmptyIcon } from "./icons";
import { getDiseaseMeta } from "../diseaseMeta";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function HistoryScreen({ t, lang, entries, onSelect, onClear }) {
  return (
    <section>
      <h2 className="screen-title">{t.history_title}</h2>
      <p className="screen-subtitle">{t.history_subtitle}</p>

      {entries.length === 0 ? (
        <div className="empty-state">
          <ImageEmptyIcon />
          <p style={{ fontWeight: 700, color: "var(--color-ink)" }}>{t.history_empty_title}</p>
          <p>{t.history_empty_body}</p>
        </div>
      ) : (
        <>
          {entries.map((entry) => {
            const meta = getDiseaseMeta(entry.predicted_class);
            const name = entry.translations?.[lang]?.disease_name ?? entry.disease_name ?? "";
            return (
              <button
                key={entry.id}
                type="button"
                className="history-item"
                onClick={() => onSelect(entry)}
              >
                <span className="history-item__swatch" style={{ background: meta.color }} />
                {entry.imagePreview && (
                  <img src={entry.imagePreview} alt="" className="history-item__thumb" />
                )}
                <span className="history-item__body">
                  <span className="history-item__name">{name}</span>
                  <span className="history-item__meta">
                    {(entry.confidence * 100).toFixed(0)}% · {formatDate(entry.savedAt)}
                  </span>
                </span>
              </button>
            );
          })}

          <button type="button" className="btn-ghost btn-block-gap" onClick={onClear}>
            {t.history_clear}
          </button>
        </>
      )}
    </section>
  );
}