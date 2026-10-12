import { useState } from "react";
import ConfidenceGauge from "./ConfidenceGauge";
import { ArrowLeftIcon, WarningIcon, FlagIconSvg, CheckCircleIcon } from "./icons";
import { getDiseaseMeta } from "../diseaseMeta";
import { flagImage } from "../api";

export default function ResultScreen({ t, lang, result, imagePreview, filename, onBack, onSave, alreadySaved }) {
  const [flagged, setFlagged] = useState(false);
  const [flagging, setFlagging] = useState(false);
  const [saved, setSaved] = useState(alreadySaved);

  const meta = getDiseaseMeta(result.predicted_class);

  // Bilingual content lives in result.translations[lang] so switching the
  // language toggle re-renders instantly, without re-uploading the image.
  // History entries (loaded from localStorage) may only have a flat
  // disease_name/description/recommendation from before this fix — fall
  // back to those so old saved entries don't break.
  const content = result.translations?.[lang] ?? {
    disease_name: result.disease_name ?? "",
    description: result.description ?? "",
    recommendation: result.recommendation ?? "",
  };

  async function handleFlag() {
    setFlagging(true);
    try {
      await flagImage({
        filename: filename || "unknown.jpg",
        predicted_class: result.predicted_class,
        confidence: result.confidence,
      });
      setFlagged(true);
    } catch {
      // Flagging is a secondary action — fail quietly rather than blocking
      // the farmer from reading their diagnosis.
    } finally {
      setFlagging(false);
    }
  }

  function handleSave() {
    onSave();
    setSaved(true);
  }

  return (
    <section>
      <button type="button" className="btn-ghost" onClick={onBack} style={{ padding: 0, marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
        <ArrowLeftIcon width={18} height={18} />
        {t.new_diagnosis}
      </button>

      {imagePreview && <img src={imagePreview} alt="" className="preview-image" style={{ marginBottom: "20px" }} />}

      <div className="result-header">
        <span className="result-tag" style={{ background: meta.color }}>
          <span className="result-tag__dot" />
          {t[meta.labelKey]}
        </span>
        <h2 className="result-name">{content.disease_name}</h2>
      </div>

      <ConfidenceGauge
        percentage={result.confidence * 100}
        color={meta.color}
        label={t.confidence_label}
      />

      {result.needs_verification && (
        <div className="verify-banner" style={{ marginTop: "20px" }}>
          <WarningIcon />
          <div>
            <strong>{t.verify_title}</strong>
            <div>{t.verify_body}</div>
          </div>
        </div>
      )}

      <div className="info-card" style={{ marginTop: "20px" }}>
        <p className="info-card__label">{t.description_label}</p>
        <p className="info-card__body">{content.description}</p>
      </div>

      <div className="info-card">
        <p className="info-card__label">{t.recommendation_label}</p>
        <p className="info-card__body">{content.recommendation}</p>
      </div>

      <div className="result-actions">
        {!saved && (
          <button type="button" className="btn btn-secondary" onClick={handleSave}>
            {t.save_result}
          </button>
        )}

        {!flagged ? (
          <button type="button" className="btn-ghost" onClick={handleFlag} disabled={flagging} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <FlagIconSvg width={16} height={16} />
            {t.flag_button}
          </button>
        ) : (
          <div className="flagged-note">
            <CheckCircleIcon width={18} height={18} />
            {t.flagged_confirmation}
          </div>
        )}
      </div>
    </section>
  );
}