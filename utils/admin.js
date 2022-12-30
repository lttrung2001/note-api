const admin = require("firebase-admin");

const serviceAccount = require("../note-8380c-firebase-adminsdk-w2lq1-64f46fc814.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'note-8380c.appspot.com'
});
const db = admin.firestore();
module.exports = { admin, db };