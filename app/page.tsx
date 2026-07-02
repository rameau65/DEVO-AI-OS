const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  background: "white",
  boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
};

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
      padding: 32
    }}>
      <section style={{ maxWidth: 960, margin: "0 auto" }}>
        <h1 style={{ fontSize: 44, marginBottom: 8 }}>DEVO-AI-OS v1.0</h1>
        <p style={{ fontSize: 20, color: "#334155" }}>
          Complex Knowledge → Story → Image → Experience → Change
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 32 }}>
          <div style={cardStyle}>
            <h2>Creative API</h2>
            <code>/api/openai</code>
          </div>
          <div style={cardStyle}>
            <h2>Router</h2>
            <code>/api/router</code>
          </div>
          <div style={cardStyle}>
            <h2>Engines</h2>
            <code>/api/engines</code>
          </div>
          <div style={cardStyle}>
            <h2>GitHub</h2>
            <code>/api/github</code>
          </div>
          <div style={cardStyle}>
            <h2>Canva</h2>
            <code>/api/canva</code>
          </div>
          <div style={cardStyle}>
            <h2>Health</h2>
            <code>/api/health</code>
          </div>
        </div>
      </section>
    </main>
  );
}
