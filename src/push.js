const webpush = require("web-push");

class Push {
  constructor({ publicKey, privateKey, email }) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.email = email;
    this.init();
  }

  init() {
    webpush.setVapidDetails(
      `mailto:${this.email}`,
      this.publicKey,
      this.privateKey
    );
  }

  /**
   * Method to send push notification to the front-end.
   * @param {Object} payload Payload of notification
   * @param {Object} payload.title Title of notification (required)
   * @param {Object} payload.body Body of notification
   * @param {String} pushSubscription user push subscription
   * @return {Promise}
   */
  async sendNotification(message, subscription) {
    if (!message || !message.title) {
      throw new Error("Incorrectly formatted message");
    }
    const pushSubscription = this._parseSubscription(subscription);
    if (
      pushSubscription &&
      pushSubscription.keys &&
      pushSubscription.keys.p256dh &&
      pushSubscription.keys.auth
    ) {
      message.badge = "/notification-badge.png";
      message.icon = "/android-chrome-192x192.png";
      try {
        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(message)
        );
      } catch (err) {
        throw new Error("Invalid Subscription");
      }
    } else {
      throw new Error("Invalid Subscription");
    }
  }

  _parseSubscription(subscription) {
    let parsedSubscription = {};
    try {
      parsedSubscription = JSON.parse(subscription);
      parsedSubscription.keys.p256dh = Buffer.from(
        parsedSubscription.keys.p256dh
      ).toString();
      parsedSubscription.keys.auth = Buffer.from(
        parsedSubscription.keys.auth
      ).toString();
    } catch (err) {
      throw new Error("Invalid Subscription");
    }
    return parsedSubscription;
  }

  static generateVAPIDKeys() {
    return webpush.generateVAPIDKeys();
  }
}

module.exports = Push;
