export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const query = getQuery(event);
  const config = useRuntimeConfig(event);

  const twitchAPI = new Twitch({
    client: config.oauth.twitch.clientId,
    secret: config.oauth.twitch.clientSecret,
    access_token: session.user.tokens.access_token
  });

  const accessResponse = await twitchAPI.getAppAccessToken();

  if (!accessResponse) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "Failed to get app access token" });

  if (Twitch.isAccessTokenExpired(session.user.tokens.expires_at)) {
    await updateTwitchRefreshToken(event, twitchAPI, session.user);
  }

  if (!query.id_webhook || !query.id_reward) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Query parameters not valid" });

  const deleteWebhook = await twitchAPI.deleteWebhook(query.id_webhook.toString());
  const deleteRweward = await twitchAPI.deleteCustomReward(session.user.id, query.id_reward.toString());

  return { success: deleteWebhook && deleteRweward };
});
