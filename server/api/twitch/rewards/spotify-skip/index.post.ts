export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = await requireUserSession(event);
  const config = useRuntimeConfig(event);

  const twitchAPI = new Twitch({
    client: config.oauth.twitch.clientId,
    secret: config.oauth.twitch.clientSecret,
    access_token: session.user.tokens.access_token
  });

  if (Twitch.isAccessTokenExpired(session.user.tokens.expires_at)) {
    await updateTwitchRefreshToken(event, twitchAPI, session.user);
  }

  const rewards = await twitchAPI.createCustomReward({
    broadcaster_id: session.user.id,
    title: body.title.toString(),
    description: body.description.toString(),
    cost: Number(body.cost),
    color: body.color?.toString(),
    input_required: false
  });
  if (!rewards) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Failed to create reward" });

  const accessResponse = await twitchAPI.getAppAccessToken();
  if (!accessResponse) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Failed to get app access token" });

  const webhook = await twitchAPI.subscribeToWebhook({
    webhook: "spotify-skip",
    broadcaster_id: session.user.id,
    reward_id: rewards.data[0].id,
    secret: config.webhook.twitch.secretKey
  });
  if (!webhook) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "Failed to subscribe to reward webhook. Please try again." });

  return webhook;
});
