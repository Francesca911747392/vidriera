-- Tablas
create table businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  slug text unique not null,
  name text not null,
  whatsapp text not null,
  theme_primary text default '#0F6E5C',
  theme_accent text default '#F2994A',
  theme_soft text default '#E4F1EC',
  created_at timestamp default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  name text not null,
  price integer not null,
  description text,
  image_url text,
  created_at timestamp default now()
);

-- Seguridad: cada dueño solo edita lo suyo, pero cualquiera puede leer (para que la tienda pública funcione)
alter table businesses enable row level security;
alter table products enable row level security;

create policy "public puede leer negocios" on businesses for select using (true);
create policy "dueño crea su negocio" on businesses for insert with check (auth.uid() = user_id);
create policy "dueño edita su negocio" on businesses for update using (auth.uid() = user_id);

create policy "public puede leer productos" on products for select using (true);
create policy "dueño crea productos" on products for insert with check (
  exists (select 1 from businesses b where b.id = business_id and b.user_id = auth.uid())
);
create policy "dueño edita productos" on products for update using (
  exists (select 1 from businesses b where b.id = business_id and b.user_id = auth.uid())
);
create policy "dueño borra productos" on products for delete using (
  exists (select 1 from businesses b where b.id = business_id and b.user_id = auth.uid())
);
