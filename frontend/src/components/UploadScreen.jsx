import { useRef, useState } from "react";
import { CameraIcon, WarningIcon } from "./icons";
import { predictImage } from "../api";

export default function UploadScreen({ t, lang, onResult, isOnline }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
  }

  function handleRetake() {
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleDiagnose() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await predictImage(file, lang);
      onResult(data, preview, file.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2 className="screen-title">{t.upload_title}</h2>
      <p className="screen-subtitle">{t.upload_subtitle}</p>

      <div className="disclaimer">
        <WarningIcon />
        <span>{t.disclaimer_short}</span>
      </div>

      <label
        className={`capture-target ${preview ? "capture-target--has-image" : ""}`}
        htmlFor="leaf-photo-input"
      >
        {preview ? (
          <img src={preview} alt="" className="preview-image" />
        ) : (
          <>
            <span className="capture-target__icon">
              <CameraIcon />
            </span>
            <span className="capture-target__hint">{t.upload_cta_empty}</span>
            <span className="capture-target__hint">{t.upload_cta_hint}</span>
          </>
        )}
        <input
          id="leaf-photo-input"
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          capture="environment"
          onChange={handleFileChange}
        />
      </label>

      {preview && (
        <button type="button" className="retake-button" onClick={handleRetake}>
          {t.retake}
        </button>
      )}

      <button
        type="button"
        className="btn btn-primary btn-block-gap"
        disabled={!file || loading || !isOnline}
        onClick={handleDiagnose}
      >
        {loading && <span className="spinner" aria-hidden="true" />}
        {loading ? t.diagnosing : t.diagnose_button}
      </button>

      {error && (
        <div className="error-banner" role="alert">
          <WarningIcon />
          <span>
            {t.error_prefix} {error} {t.error_generic_hint}
          </span>
        </div>
      )}
    </section>
  );
}
