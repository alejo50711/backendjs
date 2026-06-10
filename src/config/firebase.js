const admin = require('firebase-admin');
const fs = require('fs');

if (!admin.apps.length) {
  let serviceAccount;

  if (process.env.FIREBASE_KEY) {
    // Variable de entorno (string JSON)
    serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
  } else if (fs.existsSync('/etc/secrets/firebase-key.json')) {
    // Secret File de Render
    serviceAccount = JSON.parse(fs.readFileSync('/etc/secrets/firebase-key.json', 'utf8'));
  } else {
    // Desarrollo local
    serviceAccount = require('../../firebase-key.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
