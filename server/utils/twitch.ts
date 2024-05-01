import type { HTTPHeaderName } from "h3";
import { createHmac, timingSafeEqual } from "crypto";

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
  }

  async RefreshToken (refresh_token?: string) {
    const oauth_url = `${baseAuthURL}/token`;
    const response = await $fetch<TwitchTokenResponse>(oauth_url, {
      body: `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${this.client}&client_secret=${this.secret}`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    this.access_token = response.access_token;
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
    });
    this.app_access_token = response.access_token;
    return response;
  }

  createCustomReward (broadcaster_id: string, title: string, cost: number) {
    return $fetch<TwitchRewardResponse>(`${baseURL}/channel_points/custom_rewards?broadcaster_id=${broadcaster_id}`, {
      method: "POST",
      headers: {
        "client-id": this.client,
        "Authorization": `Bearer ${this.access_token}`
      },
      body: {
        title,
        cost,
        is_user_input_required: true,
        background_color: "#1ED760"
      }
    });
  }

  getCustomRewards(broadcaster_id: string) {
    return $fetch(`${baseURL}/channel_points/custom_rewards?broadcaster_id=${broadcaster_id}`);
  }

  subscribeToWebhook (broadcaster_id: string, reward_id: string, secret: string) {
    return $fetch(`${baseURL}/eventsub/subscriptions`, {
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
          callback: (import.meta.dev ? SITE.url.dev : SITE.url.prod) + "/api/webhooks/twitch",
          secret: secret
        }
      }
    });
  }

  static isValidWebhook (headers: Partial<Record<HTTPHeaderName, string | undefined>>, body: string, secret: string) {
    const TWITCH_MESSAGE_ID = "Twitch-Eventsub-Message-Id".toLowerCase();
    const TWITCH_MESSAGE_TIMESTAMP = "Twitch-Eventsub-Message-Timestamp".toLowerCase();
    const TWITCH_MESSAGE_SIGNATURE = "Twitch-Eventsub-Message-Signature".toLowerCase();
    const HMAC_PREFIX = "sha256=";

    const message_id = headers[TWITCH_MESSAGE_ID];
    const message_timestamp = headers[TWITCH_MESSAGE_TIMESTAMP];
    const message_signature = headers[TWITCH_MESSAGE_SIGNATURE];

    if (!message_id || !message_timestamp || !message_signature) return false;

    const message = message_id + message_timestamp + body;
    const hmac = HMAC_PREFIX + createHmac("sha256", secret).update(message).digest("hex");

    return timingSafeEqual(Buffer.from(hmac), Buffer.from(message_signature));
  }
}

export { Twitch };
