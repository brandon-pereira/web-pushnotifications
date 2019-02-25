const schedule = require("node-schedule");

class Scheduler {
  constructor({
    scheduleNotification,
    fetchNotifications,
    sendNotification,
    clearNotification
  }) {
    if (!scheduleNotification || typeof scheduleNotification !== "function") {
      throw new Error("Error: No scheduleNotification function provided.");
    }
    if (!fetchNotifications || typeof fetchNotifications !== "function") {
      throw new Error("Error: No fetchNotifications function provided.");
    }
    if (!sendNotification || typeof sendNotification !== "function") {
      throw new Error("Error: No sendNotification function provided.");
    }
    if (!clearNotification || typeof clearNotification !== "function") {
      throw new Error("Error: No clearNotifications function provided.");
    }
    this._scheduleNotification = scheduleNotification;
    this._fetchNotifications = fetchNotifications;
    this._sendNotification = sendNotification;
    this._clearNotification = clearNotification;
    this.checkAndSendNotifications = this.checkAndSendNotifications.bind(this);
    this.init();
  }

  init() {
    const rule = new schedule.RecurrenceRule();
    rule.second = [new schedule.Range(0, 59)];
    schedule.scheduleJob(rule, this.checkAndSendNotifications);
  }

  schedule(date, userId, payload) {
    return this._scheduleNotification(date, userId, payload);
  }

  async checkAndSendNotifications() {
    const notifications = this._fetchNotifications(new Date());
    if (notifications && notifications.length) {
      console.info(
        `${notifications.length} notifications in the queue. Notifying users.`
      );
      await Promise.all(
        notifications.map(async notification => {
          try {
            await this._sendNotification(notification);
            await this._clearNotification(notification);
          } catch (err) {
            await this._clearNotification(notification);
          }
        })
      );
    }
  }
}

module.exports = Scheduler;
