import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const params = getQuery(event);
  const redirect = (import.meta.dev ? SITE.url.dev : SITE.url.prod) + "/api/auth/spotify";
  if (params.client) {
    const scopes = "user-read-private user-modify-playback-state";
    return Spotify.authorize(event, {
      response_type: "code",
      client_id: params.client.toString(),
      scope: scopes,
      redirect_uri: redirect
    });
  }

  const session = await requireUserSession(event);
  const DB = useDB();
  const credentials = await DB.select().from(tables.connections).where(and(
    eq(tables.connections.type, "spotify"),
    eq(tables.connections.id_user, Number(session.user.id))
  )).get();

  if (!credentials) throw createError({ statusCode: 404, message: "No Spotify credentials found" });

  const spotifyAPI = new Spotify({
    client: credentials.client_id,
    secret: credentials.client_secret
  });

  if (!params.code) throw createError({ statusCode: 400, message: "No code provided" });

  const response = await spotifyAPI.oauthCallback(params.code.toString(), redirect);

  const connection = await DB.update(tables.connections).set({
    refresh_token: response.refresh_token
  }).where(eq(tables.connections.id, credentials.id)).returning().get();

  if (!connection) throw createError({ statusCode: 500, message: "Failed to update connection" });

  await sendRedirect(event, "/app/connections");
});
