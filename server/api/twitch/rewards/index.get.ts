import { eq } from "drizzle-orm";

export default defineEventHandler(async (event): Promise<{
  id: string;
  transport: {
    method: string;
    callback: string;
  };
  reward: {
    id: string;
    title: string;
    cost: number;
  };
}[]> => {
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

  const webhooks = await twitchAPI.getWebhooks(session.user.id);

  if (!webhooks.length) return [];

  const DB = useDB();
  const user = await DB.select({
    refresh_token: tables.users.refresh_token
  }).from(tables.users).where(eq(tables.users.id_user, Number(session.user.id))).get();

  await twitchAPI.refreshToken(user?.refresh_token);
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
        cost: reward.cost
      }
    };
  }).filter((webhook) => webhook !== undefined) as {
    id: string;
    transport: {
      method: string;
      callback: string;
    };
    reward: {
      id: string;
      title: string;
      cost: number;
    };
  }[];
});
