export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF7F0", color: "#1F2A24" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem" }}>vidriera</h1>
        <p style={{ color: "#5B6560", marginBottom: "1.5rem" }}>Tu tienda en un link, lista en minutos.</p>
        <a
          href="/login"
          style={{ background: "#0F6E5C", color: "white", padding: "0.75rem 1.5rem", borderRadius: "999px", textDecoration: "none" }}
        >
          Crear mi tienda
        </a>
      </div>
    </div>
  );
}
