"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function PublicStore() {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    load();
  }, [slug]);

  const load = async () => {
    const { data: biz } = await supabase.from("businesses").select("*").eq("slug", slug).maybeSingle();
    if (!biz) {
      setNotFound(true);
      return;
    }
    setBusiness(biz);
    const { data: prods } = await supabase.from("products").select("*").eq("business_id", biz.id).order("created_at");
    setProducts(prods || []);
  };

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id) =>
    setCart((c) => {
      const next = { ...c, [id]: (c[id] || 0) - 1 };
      if (next[id] <= 0) delete next[id];
      return next;
    });

  const items = Object.entries(cart)
    .map(([id, qty]) => ({ product: products.find((p) => String(p.id) === id), qty }))
    .filter((i) => i.product && i.qty > 0);
  const total = items.reduce((s, i) => s + Number(i.product.price) * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const waLink = () => {
    const lines = items.map((i) => `• ${i.product.name} x${i.qty} = $${Number(i.product.price) * i.qty}`);
    const text = `Hola! Quiero hacer este pedido de ${business.name}:\n${lines.join("\n")}\n\nTotal: $${total}`;
    return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  if (notFound) return <div style={{ padding: "3rem", textAlign: "center", color: "#5B6560" }}>Esta tienda no existe.</div>;
  if (!business) return <div style={{ padding: "3rem", textAlign: "center", color: "#5B6560" }}>Cargando...</div>;

  const theme = { primary: business.theme_primary, accent: business.theme_accent, soft: business.theme_soft };

  return (
    <div style={{ minHeight: "100vh", background: "#FBF7F0", color: "#1F2A24", paddingBottom: count > 0 ? "90px" : "0" }}>
      <div style={{ padding: "3rem 1.5rem 2rem", textAlign: "center", background: theme.primary }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", color: "white" }}>{business.name}</div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "1.5rem 1rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
        {products.length === 0 && <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#8A9691", padding: "3rem 0" }}>Todavía no hay productos.</div>}
        {products.map((p) => {
          const qty = cart[p.id] || 0;
          return (
            <div key={p.id} style={{ background: "white", border: "1px solid #D8CFC0", borderRadius: "0.75rem", overflow: "hidden" }}>
              <div style={{ width: "100%", aspectRatio: "1/1", background: theme.soft, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "2rem" }}>🛍️</span>}
              </div>
              <div style={{ padding: "0.75rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>{p.name}</div>
                {p.description && <div style={{ fontSize: "0.7rem", color: "#8A9691", marginTop: "0.15rem" }}>{p.description}</div>}
                <div style={{ fontSize: "0.85rem", marginTop: "0.35rem", color: theme.accent, fontFamily: "'Space Mono', monospace" }}>${p.price}</div>
                {qty > 0 ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem", background: theme.primary, borderRadius: "0.4rem", color: "white" }}>
                    <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", color: "white", padding: "0.4rem 0.7rem", cursor: "pointer" }}>−</button>
                    <span style={{ fontSize: "0.8rem" }}>{qty}</span>
                    <button onClick={() => add(p.id)} style={{ background: "none", border: "none", color: "white", padding: "0.4rem 0.7rem", cursor: "pointer" }}>+</button>
                  </div>
                ) : (
                  <button onClick={() => add(p.id)} style={{ width: "100%", marginTop: "0.5rem", background: theme.primary, color: "white", border: "none", borderRadius: "0.4rem", padding: "0.4rem", fontSize: "0.75rem" }}>
                    Agregar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {count > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "0.75rem" }}>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ maxWidth: "720px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#25D366", color: "white", borderRadius: "0.75rem", padding: "0.9rem 1.1rem", textDecoration: "none" }}
          >
            <span>{count} producto{count > 1 ? "s" : ""}</span>
            <span style={{ fontWeight: 600 }}>${total} · Pedir por WhatsApp</span>
          </a>
        </div>
      )}
    </div>
  );
}
