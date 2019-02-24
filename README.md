# Web Notifications

Web-PushNotifications  (or WPN for short) is a an easy to use library for providing push notifications on the web. We take care of all the hard stuff: scheduling, creating tokens, pushing to clients, and so on.

## Getting Started

1) Install the dependency:

```bash
npm i -S web-pushnotifications
```

2) Generate VAPID Keys, these should be stored somewhere where they can be **reused between sessions** (ex. `process.env.VAPID_PRIVATE_KEY` and `process.env.VAPID_PUBLIC_KEY`).

```js
console.log(WebPushNotifications.generateVAPIDKeys());
```

2) Instantiate an instance on the server

```js
const notifier = new WebPushNotifications({
  vapidKeys,
  getUserPushSubscription,
  fetchNotifications,
  scheduleNotification
});
```

3) Send a push notification

```js
notifier.send(userId, {
  title: "This will send immediately"
});
```

You can also defer the message till a later date by using 

```js
cont when = new Date();
notifier.schedule(when, userId, {
  title: "This will send at variable 'when'."
});
```