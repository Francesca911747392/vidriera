import { createClient } from "@supabase/supabase-js";

function safeStorage() {
  try {
    const testKey = "__supabase_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    const memoryStore = {};
    return {
      getItem: (key) => (key in memoryStore ? memoryStore[key] : null),
      setItem: (key, value) => {
        memoryStore[key] = value;
      },
      removeItem: (key) => {
        delete memoryStore[key];
      },
    };
  }
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: typeof window !== "undefined" ? safeStorage() : undefined,
      persistSession: true,
      autoRefreshToken: true,
      lock: async (name, acquireTimeout, fn) => {
        return await fn();
      },
    },
  }
);

export const palettes = [
  { name: "Bosque", primary: "#0F6E5C", accent: "#F2994A", soft: "#E4F1EC" },
  { name: "Noche", primary: "#2B2140", accent: "#D4AF37", soft: "#EAE5F2" },
  { name: "Océano", primary: "#1B4965", accent: "#62B6CB", soft: "#E1EEF2" },
  { name: "Barro", primary: "#7A4B2E", accent: "#C9A66B", soft: "#F1E7D8" },
  { name: "Rosa mar", primary: "#8E3B46", accent: "#E3A6A1", soft: "#F6E3E1" },
];
