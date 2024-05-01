export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
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

  return twitchAPI.getWebhooks(session.user.id);
});
