declare global {
  interface SpotifyAuthorize {
    response_type: string;
    client_id: string;
    scope: string;
    redirect_uri: string;
    state?: string;
  }
  interface SpotifyApiOptions {
    client?: string;
    secret?: string;
  }
  interface SpotifySearchOptions {
    q: string;
    type?: string;
    market?: string;
    limit?: number;
    offset?: number;
  }
  interface SpotifyTokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    scope?: string;
  }
  interface SpotifyTrackSearchResponse {
    tracks: {
      items: { id: string }[];
    }
  }
}

export {};
