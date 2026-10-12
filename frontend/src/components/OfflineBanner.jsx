export default function OfflineBanner({ t }) {
  return (
    <div
      role="status"
      style={{
        background: "var(--color-danger)",
        color: "#fff",
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        textAlign: "center",
        padding: "6px 12px",
      }}
    >
      {t.offline_banner}
    </div>
  );
}
