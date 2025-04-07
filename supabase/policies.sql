-- Políticas para tabela employees
alter table "public"."employees" enable row level security;

create policy "Enable read access for all users"
on "public"."employees"
for select
to authenticated
using (true);

create policy "Enable insert access for all users"
on "public"."employees"
for insert
to authenticated
with check (true);

-- Políticas para tabela products
alter table "public"."products" enable row level security;

create policy "Enable read access for all users"
on "public"."products"
for select
to authenticated
using (true);

create policy "Enable insert access for all users"
on "public"."products"
for insert
to authenticated
with check (true);

-- Políticas para tabela production_records
alter table "public"."production_records" enable row level security;

create policy "Enable read access for all users"
on "public"."production_records"
for select
to authenticated
using (true);

create policy "Enable insert access for all users"
on "public"."production_records"
for insert
to authenticated
with check (true);

create policy "Enable update access for all users"
on "public"."production_records"
for update
to authenticated
using (true);
