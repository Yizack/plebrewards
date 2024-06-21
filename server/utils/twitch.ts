import type { HTTPHeaderName } from "h3";

const baseURL = "https://api.twitch.tv/helix";
const baseAuthURL = "https://id.twitch.tv/oauth2";

class Twitch {
  client: string;
  secret: string;
  access_token?: string;
  app_access_token?: string;

  constructor (options: TwitchApiOptions) {
    this.client = options.client;
    this.secret = options.secret;
    this.access_token = options.access_token;
  }

  async refreshToken (refresh_token?: string) {
    const oauth_url = `${baseAuthURL}/token`;
    const response = await $fetch<TwitchTokenResponse>(oauth_url, {
      body: `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${this.client}&client_secret=${this.secret}`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).catch(() => null);
    if (response) this.access_token = response.access_token;
    return response;
  }

  async getAppAccessToken () {
    const oauth_url = `${baseAuthURL}/token`;
    const response = await $fetch<TwitchTokenResponse>(oauth_url, {
      body: `grant_type=client_credentials&client_id=${this.client}&client_secret=${this.secret}`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).catch(() => null);
    if (!response) return response;
    this.app_access_token = response.access_token;
    return response;
  }

  async createCustomReward (options: { broadcaster_id: string, title: string, description: string, cost: number, color?: string }) {
    const { broadcaster_id, title, description, cost, color } = options;
    const response = await $fetch<TwitchRewardResponse>(`${baseURL}/channel_points/custom_rewards?broadcaster_id=${broadcaster_id}`, {
      method: "POST",
      headers: {
        "client-id": this.client,
        "Authorization": `Bearer ${this.access_token}`
      },
      body: {
        title,
        prompt: description,
        cost,
        is_user_input_required: true,
        background_color: color || "#1ED760"
      }
    }).catch(() => null);
    return response;
  }

  async getCustomRewards (broadcaster_id: string) {
    const rewards = await $fetch<TwitchRewardResponse>(`${baseURL}/channel_points/custom_rewards?broadcaster_id=${broadcaster_id}`, {
      headers: {
        "client-id": this.client,
        "Authorization": `Bearer ${this.access_token}`
      }
    }).catch(() => null);
    return rewards ? rewards.data : [];
  }

  async deleteCustomReward (broadcaster_id: string, reward_id: string) {
    return await $fetch(`${baseURL}/channel_points/custom_rewards?broadcaster_id=${broadcaster_id}&id=${reward_id}`, {
      method: "DELETE",
      headers: {
        "client-id": this.client,
        "Authorization": `Bearer ${this.access_token}`
      }
    }).then(() => true).catch(() => false);
  }

  async getWebhooks (broadcaster_id: string) {
    const subscriptions = await $fetch<TwitchWebhooksResponse>(`${baseURL}/eventsub/subscriptions?broadcaster_user_id=${broadcaster_id}&type=channel.channel_points_custom_reward_redemption.add`, {
      headers: {
        "client-id": this.client,
        "Authorization": `Bearer ${this.app_access_token}`
      }
    }).catch(() => null);
    return subscriptions ? subscriptions.data : [];
  }

  async subscribeToWebhook (options: { webhook: string, broadcaster_id: string, reward_id: string, secret: string }) {
    const { webhook, broadcaster_id, reward_id, secret } = options;
    const response = await $fetch<TwitchWebhooksResponse>(`${baseURL}/eventsub/subscriptions`, {
      method: "POST",
      headers: {
        "client-id": this.client,
        "Authorization": `Bearer ${this.app_access_token}`
      },
      body: {
        type: "channel.channel_points_custom_reward_redemption.add",
        version: "1",
        condition: {
          broadcaster_user_id: broadcaster_id,
          reward_id: reward_id
        },
        transport: {
          method: "webhook",
          callback: (import.meta.dev ? SITE.url.tunnel : SITE.url.prod) + `/api/webhooks/${webhook}`,
          secret: secret
        }
      }
    }).catch(() => null);
    return response;
  }

  async deleteWebhook (id: string) {
    return await $fetch(`${baseURL}/eventsub/subscriptions?id=${id}`, {
      method: "DELETE",
      headers: {
        "client-id": this.client,
        "Authorization": `Bearer ${this.app_access_token}`
      }
    }).then(() => true).catch(() => false);
  }

  static async isValidWebhook (headers: Partial<Record<HTTPHeaderName, string | undefined>>, body: string, secret: string) {
    const TWITCH_MESSAGE_ID = "Twitch-Eventsub-Message-Id".toLowerCase();
    const TWITCH_MESSAGE_TIMESTAMP = "Twitch-Eventsub-Message-Timestamp".toLowerCase();
    const TWITCH_MESSAGE_SIGNATURE = "Twitch-Eventsub-Message-Signature".toLowerCase();
    const HMAC_PREFIX = "sha256=";

    const message_id = headers[TWITCH_MESSAGE_ID];
    const message_timestamp = headers[TWITCH_MESSAGE_TIMESTAMP];
    const message_signature = headers[TWITCH_MESSAGE_SIGNATURE];

    if (!message_id || !message_timestamp || !message_signature) return false;

    const message = message_id + message_timestamp + body;

    const encoder = new TextEncoder();
    const algorithm = { name: "HMAC", hash: "SHA-256" };

    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), algorithm, false, ["sign"]);
    const signature = await crypto.subtle.sign(algorithm.name, key, encoder.encode(message));
    const hmac = HMAC_PREFIX + Buffer.from(signature).toString("hex");
    return hmac === message_signature;
  }

  async sendChatMessage (broadcaster_id: string, message: string) {
    return $fetch(`${baseURL}/chat/messages`, {
      method: "POST",
      headers: {
        "client-id": this.client,
        "Authorization": `Bearer ${this.access_token}`
      },
      body: {
        broadcaster_id: broadcaster_id,
        sender_id: broadcaster_id,
        message: message
      }
    }).then(() => true).catch(() => false);
  }

  async updateRedemption (id: string, broadcaster_id: string, reward_id: string, status: "FULFILLED" | "CANCELED") {
    return $fetch(`${baseURL}/channel_points/custom_rewards/redemptions?id=${id}&broadcaster_id=${broadcaster_id}&reward_id=${reward_id}`, {
      method: "PATCH",
      headers: {
        "client-id": this.client,
        "Authorization": `Bearer ${this.access_token}`
      },
      body: {
        status: status
      }
    }).then(() => true).catch(() => false);
  }

  static isAccessTokenExpired (expires_at: number) {
    return Date.now() >= expires_at;
  }
}

export { Twitch };
