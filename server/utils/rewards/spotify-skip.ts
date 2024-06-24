import { eq, sql } from "drizzle-orm";
import type { H3Event } from "h3";

export const rewardSpotifySkip = async (event: H3Event, body: TwitchWebhookPost) => {
  const config = useRuntimeConfig(event);

  const webhookEvent = body.event;

  const DB = useDB();
  const today = Date.now();

  const connection = await DB.select({
    client_id: tables.connections.client_id,
    client_secret: tables.connections.client_secret,
    refresh_token: tables.connections.refresh_token,
    user_refresh_token: sql<string>`users.refresh_token`.as("user_refresh_token"),
    language: tables.users.language
  }).from(tables.connections).leftJoin(tables.users, eq(tables.connections.id_user, tables.users.id_user)).where(eq(tables.connections.id_user, Number(webhookEvent.broadcaster_user_id))).get();
  if (!connection) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "No connection found" });

  const spotifyAPI = new Spotify({
    client: connection.client_id,
    secret: connection.client_secret
  });

  const twitchAPI = new Twitch({
    client: config.oauth.twitch.clientId,
    secret: config.oauth.twitch.clientSecret
  });

  const spotifyTokens = await spotifyAPI.refreshToken(connection.refresh_token);
  if (!spotifyTokens) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Failed to get Spotify access token" });
  if (spotifyTokens.refresh_token !== connection.refresh_token) {
    await DB.update(tables.users).set({
      refresh_token: spotifyTokens.refresh_token,
      updated_at: today
    }).where(eq(tables.users.id_user, Number(webhookEvent.broadcaster_user_id))).run();
  }

  const twitchTokens = await twitchAPI.refreshToken(connection.user_refresh_token);
  if (!twitchTokens) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Failed to get Twitch access token" });
  if (twitchTokens.refresh_token !== connection.user_refresh_token) {
    await DB.update(tables.users).set({
      refresh_token: twitchTokens.refresh_token,
      updated_at: today
    }).where(eq(tables.users.id_user, Number(webhookEvent.broadcaster_user_id))).run();
  }

  setResponseStatus(event, 204);

  const moderators = await twitchAPI.getMods(webhookEvent.broadcaster_user_id, webhookEvent.user_id);

  if (moderators.some(data => data.user_id === webhookEvent.user_id)) {
    await twitchAPI.sendChatMessage(webhookEvent.broadcaster_user_id, `${webhookEvent.user_name} -> Executed skip to next song.`);
    await twitchAPI.updateRedemption(webhookEvent.id, webhookEvent.broadcaster_user_id, webhookEvent.reward.id, "CANCELED");
  }
  else {
    await twitchAPI.sendChatMessage(webhookEvent.broadcaster_user_id, `${webhookEvent.user_name} -> Executed skip to next song.`);
  }
};
