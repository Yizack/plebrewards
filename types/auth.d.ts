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
    updated_at: string;
    tokens: {
      access_token: string;
      refresh_token: string;
      expires_at: number;
    }
  }

  interface UserSession {
    user: User;
  }
}

export {};
