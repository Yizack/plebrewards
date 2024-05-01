import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const DB = useDB();

  return DB.delete(tables.connections).where(and(eq(tables.connections.id_user, Number(session.user.id)), eq(tables.connections.type, "spotify"))).returning({
    id_user: tables.connections.id_user,
    type: tables.connections.type
  }).get();
});
