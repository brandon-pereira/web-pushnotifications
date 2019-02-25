const Push = require("./push");
const Scheduler = require("./scheduler");

class WebPushNotifications {
  constructor(config) {
    this.vapidKeys = config.vapidKeys;
    this.push = new Push(this.vapidKeys);
    this.getUserPushSubscription = config.getUserPushSubscription;
    this.scheduler = new Scheduler({
      scheduleNotification: config.scheduleNotification,
      fetchNotifications: config.fetchNotifications,
      clearNotification: config.clearNotification,
      sendNotification: this.sendNotification.bind(this)
    });
  }

  schedule(date, userId, payload) {
    this.scheduler.schedule(date, userId, payload);
  }

  send(userId, payload) {
    this.scheduler.schedule(new Date(), userId, payload);
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
