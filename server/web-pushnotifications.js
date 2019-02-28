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
      sendNotification: this.sendNotification.bind(this)
    });
  }

  schedule(date, userId, payload) {
    this.scheduler.schedule(date, userId, payload);
  }

  send(userId, payload) {
    this.schedule(new Date(), userId, payload);
  }

  static generateVAPIDKeys() {
    return Push.generateVAPIDKeys();
  }

  async sendNotification({ userId, payload }) {
    const userSubscription = await this.getUserPushSubscription(userId);
    await this.push.sendNotification(payload, userSubscription);
  }
}
module.exports = WebPushNotifications;
