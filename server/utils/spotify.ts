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

  static authorize (event: H3Event, options: SpotifyAuthorize) {
    const params = new URLSearchParams({
      response_type: options.response_type,
      client_id: options.client_id,
      scope: options.scope,
      redirect_uri: options.redirect_uri
    });

    return sendRedirect(event, `${baseAuthURL}/authorize?${params.toString()}`);
  }

  async oauthCallback (query_code: string, redirect_uri: string) {
    const response = await $fetch<SpotifyTokenResponse>(`${baseAuthURL}/api/token?&code=${query_code}&grant_type=authorization_code&redirect_uri=${redirect_uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${this.client}:${this.secret}`)}`
      }
    }).catch(() => null);
    return response;
  }

  async refreshToken (refresh_token?: string | null) {
    const oauth_url = `${baseAuthURL}/api/token?&grant_type=refresh_token&refresh_token=${refresh_token}`;
    const response = await $fetch<SpotifyTokenResponse>(oauth_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${this.client}:${this.secret}`)}`
      }
    }).catch(() => null);
    if (response) this.access_token = response.access_token;
    return response;
  }

  async searchTrack (options: SpotifySearchOptions) {
    const params = new URLSearchParams({
      q: options.q,
      type: "track",
      limit: options.limit?.toString() || "1"
    });

    const response = await $fetch<SpotifyTrackSearchResponse>(`${baseURL}/search?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.access_token}`
      }
    }).catch(() => null);
    return response;
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
    const parts = urlWithoutQuery.split("/");
    return parts[parts.length - 1];
  }

  async getTrack (trackId: string) {
    const response = await $fetch<SpotifyTrackSearchResponse["tracks"]["items"][0]>(`${baseURL}/tracks/${trackId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.access_token}`
      }
    }).catch(() => null);
    return response;
  }

  async getQueue () {
    const response = await $fetch<SpotifyQueueResponse>(`${baseURL}/me/player/queue`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.access_token}`
      }
    }).catch(() => null);
    return response;
  }

  async skipToNext () {
    return await $fetch(`${baseURL}/me/player/next`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.access_token}`
      }
    }).then(() => true).catch(() => false);
  }
}

export { Spotify };
