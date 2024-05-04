export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const config = useRuntimeConfig(event);

  const twitchAPI = new Twitch({
    client: config.oauth.twitch.clientId,
    secret: config.oauth.twitch.clientSecret,
    access_token: session.user.tokens.access_token
  });

  const accessResponse = await twitchAPI.getAppAccessToken();
  if (!accessResponse) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "An error occurred. Please try again." });

  const webhooks = await twitchAPI.getWebhooks(session.user.id);
  if (!webhooks.length) return [];

  if (Twitch.isAccessTokenExpired(session.user.tokens.expires_at)) {
    await updateTwitchRefreshToken(event, twitchAPI, session.user);
  }

  const rewards = await twitchAPI.getCustomRewards(session.user.id);

  if (!rewards.length) return [];

  return webhooks.map((webhook) => {
    const reward = rewards.find((reward) => reward.id === webhook.condition.reward_id);
    if (!reward || !webhook.transport.callback.includes("/api/webhooks/twitch")) return undefined;

    return {
      id: webhook.id,
      transport: {
        method: webhook.transport.method,
        callback: webhook.transport.callback
      },
      reward: {
        id: reward.id,
        title: reward.title,
        description: reward.prompt,
        cost: reward.cost
      }
    };
  }).filter((webhook) => webhook !== undefined);
});
