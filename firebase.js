// Este archivo redirige a src/config/firebase.js
// Las credenciales se leen desde la variable de entorno FIREBASE_KEY
const admin = require('./src/config/firebase');
const db = admin.firestore();

module.exports = db;
