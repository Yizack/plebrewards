import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const DB = useDB();
  return DB.select({
    type: tables.connections.type,
    client_id: tables.connections.client_id,
    created_at: tables.connections.created_at,
    updated_at: tables.connections.updated_at
  }).from(tables.connections).where(eq(tables.connections.id_user, Number(params.id_user))).all();
});
