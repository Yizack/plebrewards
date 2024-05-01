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
  const response = await DB.delete(tables.connections).where(and(eq(tables.connections.id_user, body.id_user), eq(tables.connections.type, "spotify"))).returning().get();
  if (!response) {
    throw createError({
      statusCode: ErrorCode.NOT_FOUND,
      message: "Connection not found."
    });
  }

  return {
    id_user: response.id_user,
    type: response.type
  };
});
