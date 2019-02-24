const schedule = require("node-schedule");

class Scheduler {
  constructor({ scheduleNotification, fetchNotifications, sendNotification }) {
    if (!scheduleNotification || typeof scheduleNotification !== "function") {
      throw new Error("Error: No scheduleNotification function provided.");
    }
    if (!fetchNotifications || typeof fetchNotifications !== "function") {
      throw new Error("Error: No fetchNotifications function provided.");
    }
    if (!sendNotification || typeof sendNotification !== "function") {
      throw new Error("Error: No sendNotification function provided.");
    }
    this._scheduleNotification = scheduleNotification;
    this._fetchNotifications = fetchNotifications;
    this._sendNotification = sendNotification;
    this.checkAndSendNotifications = this.checkAndSendNotifications.bind(this);
    this.init();
  }

  init() {
    schedule.scheduleJob({ second: 0 }, this.checkAndSendNotifications);
    schedule.scheduleJob({ second: 15 }, this.checkAndSendNotifications);
    schedule.scheduleJob({ second: 30 }, this.checkAndSendNotifications);
    schedule.scheduleJob({ second: 45 }, this.checkAndSendNotifications);
  }

  schedule(date, userId, payload) {
    this.scheduleNotification(date, userId, payload);
  }

  scheduleNotification(date, userId, payload) {
    return this._scheduleNotification(date, userId, payload);
  }

  async checkAndSendNotifications() {
    const notifications = this._fetchNotifications(new Date());
    if (notifications && notifications.length) {
      console.info(
        `${notifications.length} notifications in the queue. Notifying users.`
      );
      await Promise.all(
        notifications.map(notification => this._sendNotification(notification))
      );
    }
  }
}

module.exports = Scheduler;
