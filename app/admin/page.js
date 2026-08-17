"use client";
import { useEffect, useState } from "react";
import { supabase, palettes } from "../../lib/supabaseClient";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bizForm, setBizForm] = useState({ name: "", slug: "", whatsapp: "" });
  const [prodForm, setProdForm] = useState({ name: "", price: "", description: "", file: null });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setUser(user);
    const { data: biz } = await supabase.from("businesses").select("*").eq("user_id", user.id).maybeSingle();
    setBusiness(biz);
    if (biz) {
      const { data: prods } = await supabase.from("products").select("*").eq("business_id", biz.id).order("created_at");
      setProducts(prods || []);
    }
    setLoading(false);
  };

  const createBusiness = async () => {
    if (!bizForm.name.trim() || !bizForm.slug.trim() || !bizForm.whatsapp.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("businesses")
      .insert({
        user_id: user.id,
        name: bizForm.name,
        slug: bizForm.slug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        whatsapp: bizForm.whatsapp,
      })
      .select()
      .single();
    setSaving(false);
    if (error) {
      alert(error.message.includes("duplicate") ? "Ese link ya está en uso, probá con otro." : error.message);
      return;
    }
    setBusiness(data);
  };

  const updateTheme = async (pal) => {
    setBusiness({ ...business, theme_primary: pal.primary, theme_accent: pal.accent, theme_soft: pal.soft });
    await supabase
      .from("businesses")
      .update({ theme_primary: pal.primary, theme_accent: pal.accent, theme_soft: pal.soft })
      .eq("id", business.id);
  };

  const addProduct = async () => {
    if (!prodForm.name.trim() || !prodForm.price.trim()) return;
    setSaving(true);
    let image_url = null;
    if (prodForm.file) {
      const ext = prodForm.file.name.split(".").pop();
      const path = `${business.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, prodForm.file);
      if (!upErr) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        image_url = data.publicUrl;
      }
    }
    const { data, error } = await supabase
      .from("products")
      .insert({ business_id: business.id, name: prodForm.name, price: Number(prodForm.price), description: prodForm.description, image_url })
      .select()
      .single();
    setSaving(false);
    if (error) {
      alert(error.message);
      return;
    }
    setProducts([...products, data]);
    setProdForm({ name: "", price: "", description: "", file: null });
  };

  const removeProduct = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    setProducts(products.filter((p) => p.id !== id));
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${business.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) return <div style={{ padding: "2rem", color: "#5B6560" }}>Cargando...</div>;

  const theme = business
    ? { primary: business.theme_primary, accent: business.theme_accent, soft: business.theme_soft }
    : palettes[0];

  if (!business) {
    return (
      <div style={{ minHeight: "100vh", background: "#FBF7F0", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ width: "100%", maxWidth: "380px", background: "white", border: "1px solid #D8CFC0", borderRadius: "1rem", padding: "2rem" }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", marginBottom: "1rem", color: "#1F2A24" }}>Contanos de tu negocio</h1>
          <input
            placeholder="Nombre del negocio"
            value={bizForm.name}
            onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })}
            style={{ width: "100%", boxSizing: "border-box", padding: "0.6rem", marginBottom: "0.75rem", border: "1px solid #D8CFC0", borderRadius: "0.5rem" }}
          />
          <input
            placeholder="link-de-tu-tienda (sin espacios)"
            value={bizForm.slug}
            onChange={(e) => setBizForm({ ...bizForm, slug: e.target.value })}
            style={{ width: "100%", boxSizing: "border-box", padding: "0.6rem", marginBottom: "0.75rem", border: "1px solid #D8CFC0", borderRadius: "0.5rem", fontFamily: "'Space Mono', monospace" }}
          />
          <input
            placeholder="WhatsApp (549...)"
            value={bizForm.whatsapp}
            onChange={(e) => setBizForm({ ...bizForm, whatsapp: e.target.value.replace(/[^0-9]/g, "") })}
            style={{ width: "100%", boxSizing: "border-box", padding: "0.6rem", marginBottom: "1rem", border: "1px solid #D8CFC0", borderRadius: "0.5rem" }}
          />
          <button
            onClick={createBusiness}
            disabled={saving}
            style={{ width: "100%", background: "#0F6E5C", color: "white", padding: "0.7rem", borderRadius: "0.5rem", border: "none" }}
          >
            {saving ? "Creando..." : "Crear mi tienda"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FBF7F0", color: "#1F2A24" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem 1.25rem" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.8rem", marginBottom: "0.25rem" }}>{business.name}</h1>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1F2A24", borderRadius: "0.75rem", padding: "0.75rem 1rem", margin: "1rem 0" }}>
          <span style={{ color: "#FBF7F0", fontFamily: "'Space Mono', monospace", fontSize: "0.8rem" }}>
            {typeof window !== "undefined" ? window.location.host : ""}/{business.slug}
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={copyLink} style={{ fontSize: "0.75rem", background: "#FBF7F0", border: "none", borderRadius: "999px", padding: "0.35rem 0.8rem" }}>
              {copied ? "copiado" : "copiar"}
            </button>
            <a href={`/${business.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", background: theme.primary, color: "white", borderRadius: "999px", padding: "0.35rem 0.8rem", textDecoration: "none" }}>
              ver tienda
            </a>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {palettes.map((pal) => (
            <button
              key={pal.name}
              onClick={() => updateTheme(pal)}
              title={pal.name}
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "999px",
                background: pal.primary,
                border: "none",
                boxShadow: theme.primary === pal.primary ? `0 0 0 2px #FBF7F0, 0 0 0 4px ${pal.primary}` : "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        <div style={{ background: "white", border: "1px solid #D8CFC0", borderRadius: "1rem", padding: "1.25rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.75rem" }}>Nuevo producto</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProdForm({ ...prodForm, file: e.target.files[0] })}
            style={{ marginBottom: "0.75rem", fontSize: "0.8rem" }}
          />
          <input
            placeholder="Nombre"
            value={prodForm.name}
            onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
            style={{ width: "100%", boxSizing: "border-box", padding: "0.6rem", marginBottom: "0.5rem", border: "1px solid #D8CFC0", borderRadius: "0.5rem" }}
          />
          <input
            placeholder="Precio"
            value={prodForm.price}
            onChange={(e) => setProdForm({ ...prodForm, price: e.target.value.replace(/[^0-9]/g, "") })}
            style={{ width: "100%", boxSizing: "border-box", padding: "0.6rem", marginBottom: "0.5rem", border: "1px solid #D8CFC0", borderRadius: "0.5rem" }}
          />
          <input
            placeholder="Descripción (opcional)"
            value={prodForm.description}
            onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
            style={{ width: "100%", boxSizing: "border-box", padding: "0.6rem", marginBottom: "0.75rem", border: "1px solid #D8CFC0", borderRadius: "0.5rem" }}
          />
          <button onClick={addProduct} disabled={saving} style={{ background: theme.primary, color: "white", padding: "0.6rem 1.2rem", borderRadius: "0.5rem", border: "none" }}>
            {saving ? "Guardando..." : "Agregar producto"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {products.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", border: "1px solid #D8CFC0", borderRadius: "0.75rem", padding: "0.6rem 0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {p.image_url ? (
                  <img src={p.image_url} alt="" style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.4rem", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.4rem", background: theme.soft }} />
                )}
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#5B6560", fontFamily: "'Space Mono', monospace" }}>${p.price}</div>
                </div>
              </div>
              <button onClick={() => removeProduct(p.id)} style={{ background: "none", border: "none", color: "#B3564A", cursor: "pointer" }}>
                borrar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
