import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const query = getQuery(event);
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

  const DB = useDB();

  const user = await DB.select({
    refresh_token: tables.users.refresh_token
  }).from(tables.users).where(eq(tables.users.id_user, Number(session.user.id))).get();

  const response = await twitchAPI.refreshToken(user?.refresh_token);

  if (!response) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: "Failed to get access token"
    });
  }

  if (!query.id_webhook || !query.id_reward) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: "Query parameters not valid"
    });
  }

  await twitchAPI.deleteWebhook(query.id_webhook.toString());
  await twitchAPI.deleteCustomReward(session.user.id, query.id_reward.toString());

  return { success: true };
});
