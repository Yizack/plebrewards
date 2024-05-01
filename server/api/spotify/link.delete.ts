import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const body = await readBody(event);

  if (session.user.id !== body.id_user) {
    throw createError({
      statusCode: ErrorCode.FORBIDDEN,
      message: "You are not authorized to delete this connection."
    });
  }

  const DB = useDB();
  return DB.delete(tables.connections).where(and(eq(tables.connections.id_user, body.id_user), eq(tables.connections.type, "spotify"))).returning({
    id_user: tables.connections.id_user,
    type: tables.connections.type
  }).get();
});
