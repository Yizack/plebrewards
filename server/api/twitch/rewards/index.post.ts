import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = await requireUserSession(event);
  const config = useRuntimeConfig(event);

  const DB = useDB();

  const user = await DB.select({
    refresh_token: tables.users.refresh_token
  }).from(tables.users).where(eq(tables.users.id_user, Number(session.user.id))).get();

  const twitchAPI = new Twitch({
    client: config.oauth.twitch.clientId,
    secret: config.oauth.twitch.clientSecret
  });

  const response = await twitchAPI.refreshToken(user?.refresh_token);

  if (!response) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: "Failed to get access token"
    });
  }

  if (response.refresh_token !== user?.refresh_token) {
    await DB.update(tables.users).set({ refresh_token: response.refresh_token }).where(eq(tables.users.id_user, Number(session.user.id))).run();
  }

  const rewards = await twitchAPI.createCustomReward(session.user.id, body.title.toString(), Number(body.cost));
  const appAccess = await twitchAPI.getAppAccessToken();

  if (!appAccess) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: "Failed to get app access token"
    });
  }

  const webhook = await twitchAPI.subscribeToWebhook(session.user.id, rewards.data[0].id, config.twitch.webhookSecret);

  return webhook;
});
