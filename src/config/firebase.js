const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

if (!getApps().length) {
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

  initializeApp({
    credential: cert(serviceAccount),
  });
}

module.exports = { getFirestore };
