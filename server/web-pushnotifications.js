const Push = require("./utils/push");
const Scheduler = require("./utils/scheduler");

class WebPushNotifications {
  constructor(config) {
    this.vapidKeys = config.vapidKeys;
    this.push = new Push(this.vapidKeys, {
      defaults: config.notificationDefaults || {}
    });
    this.getUserPushSubscription = config.getUserPushSubscription;
    this.scheduler = new Scheduler({
      adapter: config.adapter,
      removeUserPushSubscription: config.removeUserPushSubscription,
      sendNotification: this.sendNotification.bind(this)
    });
  }

  schedule(date, userId, payload) {
    return this.scheduler.schedule(date, userId, payload);
  }

  send(userId, payload) {
    return this.schedule(new Date(), userId, payload);
  }

  cancelNotification(id) {
    return this.scheduler.cancelNotification(id);
  }

  static generateVAPIDKeys() {
    return Push.generateVAPIDKeys();
  }

  async sendNotification({ userId, payload }) {
    const userSubscription = await this.getUserPushSubscription(userId);
    if (Array.isArray(userSubscription)) {
      await Promise.all(
        userSubscription.map(subscription =>
          this.push.sendNotification(userId, payload, subscription)
        )
      );
    } else {
      await this.push.sendNotification(userId, payload, userSubscription);
    }
  }
}
module.exports = WebPushNotifications;
