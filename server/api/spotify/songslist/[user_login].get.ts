import { eq, and, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user_login } = getRouterParams(event);

  const connection = await db.select({
    id_user: tables.connections.id_user,
    client_id: tables.connections.client_id,
    client_secret: tables.connections.client_secret,
    refresh_token: tables.connections.refresh_token
  }).from(tables.connections).leftJoin(tables.users,
    eq(tables.connections.id_user, tables.users.id_user)
  ).where(and(
    eq(tables.connections.type, "spotify"),
    eq(tables.users.user_login, user_login!)
  )).get();

  if (!connection) throw createError({ status: ErrorCode.NOT_FOUND, message: "Spotify connection not found" });

  const spotifyAPI = new Spotify({
    client: connection.client_id,
    secret: connection.client_secret
  });

  const today = Date.now();

  const spotifyTokens = await spotifyAPI.refreshToken(connection.refresh_token);
  if (!spotifyTokens) throw createError({ status: ErrorCode.BAD_REQUEST, message: "Failed to get Spotify access token" });
  if (spotifyTokens.refresh_token !== connection.refresh_token) {
    await db.update(tables.users).set({
      refresh_token: spotifyTokens.refresh_token,
      updated_at: today
    }).where(eq(tables.users.id_user, connection.id_user)).run();
  }

  const queue = await spotifyAPI.getQueue();

  const currently_playing = (!queue || !queue.currently_playing) ? null : {
    track_id: queue.currently_playing.id,
    track_name: queue.currently_playing.name,
    track_artists: queue.currently_playing.artists.map(artist => artist.name).join(", "),
    image: {
      url: queue.currently_playing.album.images[0]!.url,
      width: queue.currently_playing.album.images[0]!.width,
      height: queue.currently_playing.album.images[0]!.height
    }
  };

  const next_in_queue = (!queue || !queue.currently_playing) ? null : queue.queue[0]!.id;

  const songslist = await db.select({
    user_login: tables.songlists.user_login,
    track_id: tables.songlists.track_id,
    track_name: tables.songlists.track_name,
    track_artists: tables.songlists.track_artists,
    user_requested: tables.songlists.user_requested,
    date_added: tables.songlists.date_added
  }).from(tables.songlists).where(
    eq(tables.songlists.user_login, user_login!)
  ).orderBy(desc(tables.songlists.date_added)).all();

  let playing = false;

  const list = songslist.map((song, i) => {
    if (currently_playing && (song.track_id === currently_playing.track_id) && !playing && (i === 0 || (i > 0 && songslist[i - 1]! && songslist[i - 1]?.track_id === next_in_queue))) {
      playing = true;
    }
    else playing = false;
    return { ...song, playing };
  });

  return { list, currently_playing };
});
