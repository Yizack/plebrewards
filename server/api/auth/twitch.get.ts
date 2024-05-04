export default oauth.twitchEventHandler({
  config: {
    emailRequired: true,
    scope: ["channel:manage:redemptions", "user:write:chat"]
  },
  async onSuccess(event, result) {
    const user = result.user;
    const today = Date.now();

    user.tokens = {
      access_token: result.tokens.access_token,
      refresh_token: result.tokens.refresh_token,
      expires_at: today + (result.tokens.expires_in * 1000)
    };

    const DB = useDB();
    await DB.insert(tables.users).values({
      id_user: Number(user.id),
      user_login: user.login,
      username: user.display_name,
      refresh_token: user.tokens.refresh_token,
      created_at: today,
      updated_at: today,
    }).onConflictDoUpdate({
      target: tables.users.id_user,
      set: {
        user_login: user.login,
        username: user.display_name,
        refresh_token: user.tokens.refresh_token,
        updated_at: today,
      }
    }).returning().get();

    await setUserSession(event, { user });
    return sendRedirect(event, "/app");
  }
});
