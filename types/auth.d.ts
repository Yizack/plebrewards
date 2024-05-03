// auth.d.ts
declare module "#auth-utils" {
  interface User {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email: string;
    created_at: string;
    tokens: {
      access_token: string;
      expires_in: number;
      refresh_token: string;
      token_type: string;
    }
  }

  interface UserSession {
    user: User;
  }
}

export {};
