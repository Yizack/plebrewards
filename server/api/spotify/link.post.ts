export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const DB = useDB();

  const today = Date.now();
  return DB.insert(tables.connections).values({
    id_user: body.id_user,
    type: "spotify",
    client_id: body.client_id,
    client_secret: body.client_secret,
    created_at: today,
    updated_at: today
  }).onConflictDoUpdate({
    target: [tables.connections.id_user, tables.connections.type],
    set: {
      client_id: body.client_id,
      client_secret: body.client_secret,
      updated_at: today
    }
  }).returning().get();
});
