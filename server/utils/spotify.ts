import type { H3Event } from "h3";

const baseURL = "https://api.spotify.com/v1";
const baseAuthURL = "https://accounts.spotify.com";

class Spotify {

  client?: string;
  secret?: string;
  access_token?: string;

  constructor (options: SpotifyApiOptions) {
    this.client = options.client;
    this.secret = options.secret;
  }

  getCurrentUser (user_access_token: string) {
    const url = `${baseURL}/me`;
    return $fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + user_access_token
      }
    });
  }

  static authorize (event: H3Event, options: SpotifyAuthorize) {
    const params = new URLSearchParams({
      response_type: options.response_type,
      client_id: options.client_id,
      scope: options.scope,
      redirect_uri: options.redirect_uri
    });

    return sendRedirect(event, `${baseAuthURL}/authorize?${params.toString()}`);
  }

  oauthCallback (query_code: string, redirect_uri: string) {
    return $fetch<SpotifyTokenResponse>(`${baseAuthURL}/api/token?&code=${query_code}&grant_type=authorization_code&redirect_uri=${redirect_uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${this.client}:${this.secret}`)}`
      },
    });
  }

  async refreshToken (refresh_token?: string | null) {
    const oauth_url = `${baseAuthURL}/api/token?&grant_type=refresh_token&refresh_token=${refresh_token}`;
    const response = await $fetch<SpotifyTokenResponse>(oauth_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${this.client}:${this.secret}`)}`
      },
    }).catch(() => null);
    if (response) this.access_token = response.access_token;
    return response;
  }

  searchTrack (options: SpotifySearchOptions) {
    const params = new URLSearchParams({
      q: options.q,
      type: "track",
      limit: options.limit?.toString() || "1"
    });

    return $fetch<SpotifyTrackSearchResponse>(`${baseURL}/search?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.access_token}`
      }
    });
  }

  async addToQueue (trackId: string) {
    const uriEncoded = encodeURIComponent(`spotify:track:${trackId}`);
    return await $fetch(`${baseURL}/me/player/queue?uri=${uriEncoded}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.access_token}`
      }
    }).then(() => true).catch(() => false);
  }

  static isValidTrackURL (url: string) {
    return url.includes("open.spotify.com/track/") || url.includes("open.spotify.com/intl-es/track/");
  }

  static getTrackIdFromURL (url: string) {
    const urlWithoutQuery = url.split("?")[0];
    const parts = urlWithoutQuery .split("/");
    return parts[parts.length - 1];
  }

  getTrack (trackId: string) {
    return $fetch<SpotifyTrackSearchResponse["tracks"]["items"][0]>(`${baseURL}/tracks/${trackId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.access_token}`
      }
    });
  }
}

export { Spotify };
