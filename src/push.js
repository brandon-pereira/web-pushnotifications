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
  sendNotification(message, subscription) {
    const pushSubscription = this._parseSubscription(subscription);
    console.log(message, pushSubscription);
    if (
      pushSubscription &&
      pushSubscription.keys &&
      pushSubscription.keys.p256dh &&
      pushSubscription.keys.auth &&
      message &&
      message.title
    ) {
      message.badge = "/notification-badge.png";
      message.icon = "/android-chrome-192x192.png";
      return webpush.sendNotification(
        pushSubscription,
        JSON.stringify(message)
      );
    } else {
      throw new Error("Invalid message or pushsubscription");
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
      throw new Error("Invalid/Corrupt Push Subscription");
    }
    return parsedSubscription;
  }

  static generateVAPIDKeys() {
    return webpush.generateVAPIDKeys();
  }
}

module.exports = Push;
