const schedule = require("node-schedule");

class Scheduler {
  constructor({ adapter, sendNotification }) {
    if (!adapter) {
      throw new Error("Error: No adapter provided.");
    }
    this.adapter = adapter;
    this.sendNotification = sendNotification;
    this.checkAndSendNotifications = this.checkAndSendNotifications.bind(this);
    this.init();
  }

  init() {
    const rule = new schedule.RecurrenceRule();
    rule.second = [new schedule.Range(0, 59)];
    schedule.scheduleJob(rule, () => this.checkAndSendNotifications());
  }

  schedule(date, userId, payload) {
    return this.adapter.scheduleNotification(date, userId, payload);
  }

  async checkAndSendNotifications() {
    const notifications = await this.adapter.fetchNotifications(new Date());
    if (notifications && notifications.length) {
      console.info(
        `${notifications.length} notifications in the queue. Notifying users.`
      );
      await Promise.all(
        notifications.map(async notification => {
          try {
            await this.sendNotification(notification);
            await this.adapter.clearNotification(notification);
          } catch (err) {
            console.error(
              "Error sending notification, removing from queue",
              err
            );
            await this.adapter.clearNotification(notification);
          }
        })
      );
    }
  }
}

module.exports = Scheduler;
