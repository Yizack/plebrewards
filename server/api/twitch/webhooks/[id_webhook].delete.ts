export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const params = getRouterParams(event);
  const config = useRuntimeConfig(event);

  const twitchAPI = new Twitch({
    client: config.oauth.twitch.clientId,
    secret: config.oauth.twitch.clientSecret
  });

  const appAccess = await twitchAPI.getAppAccessToken();

  if (!appAccess) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: "Failed to get app access token"
    });
  }

  return twitchAPI.deleteWebhook(params.id_webhook.toString());
});
