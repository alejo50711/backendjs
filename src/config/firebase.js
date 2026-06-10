const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

if (!admin.apps.length) {
  let serviceAccount;

  if (process.env.FIREBASE_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
  } else {
    const localKey = path.resolve(__dirname, '../../firebase-key.json');
    if (!fs.existsSync(localKey)) {
      throw new Error('Firebase no configurado: define FIREBASE_KEY en las variables de entorno');
    }
    serviceAccount = JSON.parse(fs.readFileSync(localKey, 'utf8'));
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
