var webPush = require('web-push');

const vapidKeys = {
   "publicKey": "BCGxaS-OcWitn_sZF-JVdxFkCvQm9fJL738UmHEsCSxHb59JJMSJjIyVZSlL88ohbaJ-VQu6FQ_qAiGxYA1oBvQ",
   "privateKey": "hLAfeX-J1LJnVnLvK9sMLLyxurYiG4mo2L28eZV70E4"
};


webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "endpointhttps://fcm.googleapis.com/fcm/send/fj9Mc5vJSgI:APA91bFD7D0BQ8EVMh5jaQBg5i0n9aWcPQZ_ktUe_cnOk4-hhRk0m4i3Rfc1_SfqnaABfspnpbwX4v19Mnpy2TUSi6rhVEIA747LcWfGXCGgMEWOin32N69NUl0gFqlOGLx8dQxlu5qL",
   "keys": {
       "p256dh": "BAksL9dDCMjRMWP0zk+EJK+K1u08FLQ6DnG0oy6ZKZhZ+MVtrqn30ZgCGU3IEqZyMgW7L27H9imamFkWuV4mLO0=",
       "auth": "O6ErNMEzAJtDB5aMmqxjmA=="
   }
};
var payload = 'Berhasil push notification!';

var options = {
   gcmAPIKey: '69978700290',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);