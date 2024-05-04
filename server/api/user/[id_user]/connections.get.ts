import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const query = getQuery(event);

  const type = query.type ? eq(tables.connections.type, query.type.toString()) : undefined;

  const DB = useDB();
  return DB.select({
    type: tables.connections.type,
    client_id: tables.connections.client_id,
    created_at: tables.connections.created_at,
    updated_at: tables.connections.updated_at
  }).from(tables.connections).where(and(eq(tables.connections.id_user, Number(params.id_user)), type)).all();
});
