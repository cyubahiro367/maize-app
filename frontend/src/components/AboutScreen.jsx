import { LeafIcon } from "./icons";

export default function AboutScreen({ t }) {
  return (
    <section>
      <h2 className="screen-title">{t.about_title}</h2>

      <div className="about-section">
        <h2>{t.about_purpose_title}</h2>
        <p>{t.about_purpose_body}</p>
        <div className="about-badges">
          <span className="about-badge">MobileNetV2</span>
          <span className="about-badge">Nyagatare</span>
          <span className="about-badge">Musanze</span>
        </div>
      </div>

      <div className="about-section">
        <h2>{t.about_limits_title}</h2>
        <p>{t.about_limits_body}</p>
      </div>

      <div className="about-section">
        <h2>{t.about_privacy_title}</h2>
        <p>{t.about_privacy_body}</p>
      </div>

      <div className="about-section">
        <h2>{t.about_contact_title}</h2>
        <p>{t.about_contact_body}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", opacity: 0.4, marginTop: "32px" }}>
        <LeafIcon width={28} height={28} />
      </div>
    </section>
  );
}
