import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const headers = getHeaders(event);
  const rawBody = await readRawBody(event);
  const body = await readBody<TwitchWebhookPost>(event);

  if (!rawBody) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "No body provided" });

  const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type".toLowerCase();
  const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";

  if (headers[MESSAGE_TYPE] === MESSAGE_TYPE_VERIFICATION) return body.challenge;

  const config = useRuntimeConfig(event);
  const isvalidWebhook = await Twitch.isValidWebhook(headers, rawBody, config.twitch.webhookSecret);

  if (!isvalidWebhook || !body.event) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "Invalid webhook" });

  const webhookEvent = body.event;
  const DB = useDB();
  const connection = await DB.select().from(tables.connections).where(eq(tables.connections.id_user, Number(webhookEvent.broadcaster_user_id))).get();

  const spotifyAPI = new Spotify({
    client: connection?.client_id,
    secret: connection?.client_secret
  });

  const twitchAPI = new Twitch({
    client: config.oauth.twitch.clientId,
    secret: config.oauth.twitch.clientSecret
  });

  const spotifyTokens = await spotifyAPI.refreshToken(connection?.refresh_token);

  if (!spotifyTokens) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Failed to get Spotify access token" });

  if (spotifyTokens.refresh_token !== connection?.refresh_token) {
    await DB.update(tables.users).set({ refresh_token: spotifyTokens.refresh_token }).where(eq(tables.users.id_user, Number(webhookEvent.broadcaster_user_id))).run();
  }

  const isURL = Spotify.isValidTrackURL(webhookEvent.user_input);
  const user = await DB.select({
    refresh_token: tables.users.refresh_token
  }).from(tables.users).where(eq(tables.users.id_user, Number(webhookEvent.broadcaster_user_id))).get();

  const twitchTokens = await twitchAPI.refreshToken(user?.refresh_token);

  if (!twitchTokens) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Failed to get Twitch access token" });

  if (twitchTokens.refresh_token !== user?.refresh_token) {
    await DB.update(tables.users).set({ refresh_token: twitchTokens.refresh_token }).where(eq(tables.users.id_user, Number(webhookEvent.broadcaster_user_id))).run();
  }

  setResponseStatus(event, 204);

  const track = {
    name: "",
    artists: "",
    id: ""
  };

  if (!isURL) {
    const search = await spotifyAPI.searchTrack({
      q: webhookEvent.user_input,
      limit: 1
    }).catch(() => null);

    if (!search || !search.tracks.items.length) {
      console.info("No tracks found");
      await twitchAPI.sendChatMessage(webhookEvent.broadcaster_user_id, "No tracks found with the provided input. PunOko");
      await twitchAPI.updateRedemption(webhookEvent.id, webhookEvent.broadcaster_user_id, webhookEvent.reward.id, "CANCELED");
      return body;
    }

    track.id = search.tracks.items[0].id;

    track.name = search.tracks.items[0].name;
    track.artists = search.tracks.items[0].artists.map((artist) => artist.name).join(", ");
  }
  else {
    track.id = Spotify.getTrackIdFromURL(webhookEvent.user_input);
    const trackResponse = await spotifyAPI.getTrack(track.id).catch(() => null);
    if (trackResponse) {
      track.name = trackResponse.name;
      track.artists = trackResponse.artists.map((artist) => artist.name).join(", ");
    }
  }

  const queued = await spotifyAPI.addToQueue(track.id);

  if (!queued) {
    await twitchAPI.sendChatMessage(webhookEvent.broadcaster_user_id, "It was not possible to add to the queue at this time. PoroSad");
    await twitchAPI.updateRedemption(webhookEvent.id, webhookEvent.broadcaster_user_id, webhookEvent.reward.id, "CANCELED");
    return body;
  }

  await twitchAPI.sendChatMessage(webhookEvent.broadcaster_user_id, `💿 "${track.artists} - ${track.name}" requested by @${webhookEvent.user_login} has been added to the queue.`);
  return body;
});
