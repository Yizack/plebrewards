declare global {
  interface TwitchApiOptions {
    client: string;
    secret: string;
    access_token?: string;
  }
  interface TwitchTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string[];
    token_type: string;
  }
  interface TwitchWebhooksResponse {
    total: number;
    data: {
      id: string;
      status: string;
      type: string;
      version: string;
      condition: {
        broadcaster_user_id: string;
        reward_id: string;
      };
      created_at: string;
      transport: {
        method: string;
        callback: string;
      };
      cost: number;
    }[];
    max_total_cost: number;
    total_cost: number;
    pagination: {
      cursor: string;
    };
  }
  interface TwitchWebhookPost {
    subscription: TwitchWebhooksResponse["data"][0];
    event: {
      broadcaster_user_id: string;
      broadcaster_user_login: string;
      broadcaster_user_name: string;
      id: string;
      user_id: string;
      user_login: string;
      user_name: string;
      user_input: string;
      status: string;
      redeemed_at: string;
      reward: {
        id: string;
        title: string;
        prompt: string;
        cost: number;
      };
    };
    challenge?: string;
  }
  interface TwitchRewardResponse {
    data: {
      broadcaster_name: string;
      broadcaster_login: string;
      broadcaster_id: string;
      id: string;
      image: string;
      background_color: string;
      is_enabled: boolean;
      cost: number;
      title: string;
      prompt: string;
      is_user_input_required: boolean;
      max_per_stream_setting: {
        is_enabled: boolean;
        max_per_stream: number;
      };
      max_per_user_per_stream_setting: {
        is_enabled: boolean;
        max_per_user_per_stream: number;
      };
      global_cooldown_setting: {
        is_enabled: boolean;
        global_cooldown_seconds: number;
      };
      is_paused: boolean;
      is_in_stock: boolean;
      default_image: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
      };
      should_redemptions_skip_request_queue: boolean;
      redemptions_redeemed_current_stream: number;
      cooldown_expires_at: number;
    }[];
  }
  interface TwitchModsResponse {
    data: {
      user_id: string;
      user_login: string;
      user_name: string;
    }[];
    pagination: {
      cursor: string;
    };
  }
}

export {};
