# Cómo publicar tu tienda (vidriera)

## 1. Preparar Supabase
1. Entrá a tu proyecto en supabase.com
2. Andá a **SQL Editor** → pegá todo el contenido de `supabase-setup.sql` → Run
3. Andá a **Storage** → **New bucket** → nombre: `product-images` → marcá **Public bucket** → Create
4. Andá a **Settings → API** → copiá:
   - Project URL
   - anon public key
   (los vas a necesitar en el paso 3)

## 2. Subir el código a GitHub
1. Entrá a github.com → botón verde **New** (repositorio nuevo)
2. Ponele de nombre `vidriera-app`, dejalo público o privado, **Create repository**
3. En la página del repo vacío, click en **uploading an existing file**
4. Arrastrá TODOS los archivos y carpetas de este proyecto (menos `node_modules` y `.next`, que no existen todavía) y hacé commit

## 3. Publicar en Vercel
1. Entrá a vercel.com → **Add New → Project**
2. Elegí el repositorio `vidriera-app` que acabás de subir → **Import**
3. Antes de darle Deploy, abrí **Environment Variables** y agregá:
   - `NEXT_PUBLIC_SUPABASE_URL` → pegá tu Project URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → pegá tu anon key de Supabase
4. Click en **Deploy** y esperá ~1 minuto

## 4. Probarlo
- Vercel te va a dar un link tipo `vidriera-app.vercel.app`
- Entrá ahí → **Crear mi tienda** → registrate con tu email
- Elegí el link de tu negocio (por ejemplo `casa-lumbre`)
- Cargá un producto con foto
- Abrí `vidriera-app.vercel.app/casa-lumbre` en Safari — ¡ya va a abrir de verdad!

## Después, si querés tu propio dominio
En Vercel → tu proyecto → **Settings → Domains** → agregás el dominio que compres (ej: en Namecheap o Google Domains) y seguís las instrucciones para conectarlo.
