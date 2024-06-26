import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const config = useRuntimeConfig(event);
  const output: { connected: boolean, rewards: Rewards[] } = { connected: false, rewards: [] };

  const DB = useDB();
  const connection = await DB.select({
    type: tables.connections.type
  }).from(tables.connections).where(and(eq(tables.connections.id_user, Number(session.user.id)), eq(tables.connections.type, "spotify"))).get();

  if (!connection) return output;

  output.connected = true;

  const twitchAPI = new Twitch({
    client: config.oauth.twitch.clientId,
    secret: config.oauth.twitch.clientSecret,
    access_token: session.user.tokens.access_token
  });

  const accessResponse = await twitchAPI.getAppAccessToken();
  if (!accessResponse) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "An error occurred. Please try again." });

  const twitchWebhooks = await twitchAPI.getWebhooks(session.user.id);
  if (!twitchWebhooks.length) return output;

  if (Twitch.isAccessTokenExpired(session.user.tokens.expires_at)) {
    await updateTwitchRefreshToken(event, twitchAPI, session.user);
  }

  const rewards = await twitchAPI.getCustomRewards(session.user.id);

  if (!rewards.length) return output;

  output.rewards = twitchWebhooks.map((webhook) => {
    const reward = rewards.find(reward => reward.id === webhook.condition.reward_id);
    const isReward = webhook.transport.callback.includes("/api/webhooks/spotify-sr") || webhook.transport.callback.includes("/api/webhooks/twitch");
    if (!reward || !isReward) return undefined;

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
        cost: reward.cost,
        color: reward.background_color
      }
    };
  }).filter(webhook => webhook !== undefined) as Rewards[];

  return output;
});
