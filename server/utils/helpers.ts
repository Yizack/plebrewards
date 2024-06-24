import { eq } from "drizzle-orm";
import type { H3Event } from "h3";
import type { User } from "#auth-utils";

export { ErrorCode } from "~~/types/enums/errors";
export { SITE } from "~~/app/utils/site";

export const updateTwitchRefreshToken = async (event: H3Event, twitchAPI: InstanceType<typeof Twitch>, user: User) => {
  const refreshResponse = await twitchAPI.refreshToken(user.tokens.refresh_token);
  if (!refreshResponse) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "An error occurred. Please try again." });
  if (refreshResponse.refresh_token !== user.tokens.refresh_token) {
    const DB = useDB();
    await DB.update(tables.users).set({
      refresh_token: refreshResponse.refresh_token,
      updated_at: Date.now()
    }).where(eq(tables.users.id_user, Number(user.id))).run();
    await setUserSession(event, { user: { ...user, tokens: { ...user.tokens, refresh_token: refreshResponse.refresh_token } } });
  }
};
