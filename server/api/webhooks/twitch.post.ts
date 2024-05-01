import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const headers = getHeaders(event);
  const rawBody = await readRawBody(event);
  const body = await readBody(event);

  if (!rawBody) throw createError({ statusCode: 400, message: "No body provided" });

  const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type".toLowerCase();
  const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";

  if (headers[MESSAGE_TYPE] === MESSAGE_TYPE_VERIFICATION) return body.challenge;

  const config = useRuntimeConfig(event);
  if (Twitch.isValidWebhook(headers, rawBody, config.twitch.webhookSecret)) {
    const webhook = body.event;
    const DB = useDB();
    const connection = await DB.select().from(tables.connections).where(eq(tables.connections.id_user, Number(webhook.broadcaster_user_id))).get();

    const spotifyAPI = new Spotify({
      client: connection?.client_id,
      secret: connection?.client_secret
    });

    await spotifyAPI.refreshToken(connection?.refresh_token);
    const isURL = Spotify.isValidTrackURL(webhook.user_input);
    if (!isURL) {
      const search = await spotifyAPI.searchTrack({
        q: webhook.user_input,
        limit: 1
      });

      if (!search.tracks.items.length) {
        console.info("No tracks found");
      }

      await spotifyAPI.addToQueue(search.tracks.items[0].id);
    }
    else {
      await spotifyAPI.addToQueue(Spotify.getTrackIdFromURL(webhook.user_input));
    }
  }
  setResponseStatus(event, 204);
  return body;
});
