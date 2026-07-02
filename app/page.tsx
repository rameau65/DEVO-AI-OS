const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  background: "white",
  boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
};

export default function Home() {
  const endpoints = ["/api/onemind", "/api/openai", "/api/router", "/api/workflows", "/api/engines", "/api/canva", "/api/github", "/api/mcp", "/api/memory", "/api/health", "/admin"];
  return (
    <main style={{ minHeight: "100vh", fontFamily: "Arial, sans-serif", background: "linear-gradient(180deg,#f8fafc,#eef2ff)", padding: 32 }}>
      <section style={{ maxWidth: 1080, margin: "0 auto" }}>
        <h1 style={{ fontSize: 44, marginBottom: 8 }}>DEVO-AI-OS v2.0</h1>
        <p style={{ fontSize: 20, color: "#334155" }}>OneMind Engine Integrated Creative Operating System</p>
        <p style={{ fontSize: 16, color: "#475569" }}>Complex Knowledge → Story → Image → Experience → Change</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 16, marginTop: 32 }}>
          {endpoints.map((endpoint) => (
            <div key={endpoint} style={cardStyle}>
              <h2 style={{ fontSize: 18 }}>{endpoint}</h2>
              <code>{endpoint}</code>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
