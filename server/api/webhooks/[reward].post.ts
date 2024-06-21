export default defineEventHandler(async (event) => {
  const headers = getHeaders(event);
  const rawBody = await readRawBody(event);
  const body = await readBody<TwitchWebhookPost>(event);
  const { reward } = getRouterParams(event);

  if (!rawBody) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "No body provided" });

  const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type".toLowerCase();
  const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";

  if (headers[MESSAGE_TYPE] === MESSAGE_TYPE_VERIFICATION) return body.challenge;
  const isvalidWebhook = await webhooks.isValidTwitchWebhook(event);

  if (!isvalidWebhook) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "Invalid webhook" });

  switch (reward) {
    case "spotify-sr":
    case "twitch":
      return await rewardSpotifySR(event, body);
    default:
      return body;
  }
});
