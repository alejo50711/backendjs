const exampleService = require('../services/example.service');
const { Pool } = require('pg');
const { getFirestore } = require('../config/firebase');
const bcrypt = require('bcrypt');
const admin = require("firebase-admin");
const getAll = (req, res, next) => {
  try {
    const data = exampleService.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getById = (req, res, next) => {
  try {
    const item = exampleService.getById(Number(req.params.id));
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

const usuarios = async (req, res) => {
  try {
    const db = getFirestore();
    const { nombre, apellido, role,user,password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const docRef = await db.collection('usuarios').add({
      nombre,
      apellido,
      role,
      user,
      password:hash,
      fechaCreacion: new Date()
    });

    res.status(201).json({
      success: true,
      id: docRef.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


const personal = async (req, res) => {
  try {
    const db = getFirestore();
    const { nombre, apellido, role,user,password ,correo,idcreador} = req.body;
    const hash2 = await bcrypt.hash(password, 10);

    const docRef = await db.collection('personal').add({
      nombre,
      apellido,
      role,
      user,
      password:hash2,
      correo,
      idcreador,
      fechaCreacion: new Date()
    });

    res.status(201).json({
      success: true,
      id: docRef.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getpersonal = async (req, res) => {
  try {
    const db = getFirestore();

    const { id } = req.body;

    const snapshot = await db
      .collection('personal')
      .where('idcreador', '==', id)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        mensaje: 'El empleador no tiene trabajadores'
      });
    }

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


const login = async(req,res)=>{
  try {
    const db = getFirestore();

    const { user, password } = req.body;

    const snapshot = await db
      .collection('usuarios')
      .where('user', '==', user)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({
        success: false,
        mensaje: 'Correo o contraseña incorrectos'
      });
    }

    const usuario = snapshot.docs[0];
    const datos = usuario.data();

    const coincide = await bcrypt.compare(
      password,
      datos.password
    );

    if (!coincide) {
      return res.status(401).json({
        success: false,
        mensaje: 'Correo o contraseña incorrectos'
      });
    }

    res.json({
      success: true,
      usuario: {
        id: usuario.id,
        nombre: datos.nombre,
        correo: datos.correo
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
}

const tabla = async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        apellido VARCHAR(100),
        role VARCHAR(50),
        creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

const guestList = [
  "Jesus", "Ayza", "Elena", "Gustavo", "Liliana", "Ayxin", "Edith", "Zury",
  "Luis", "Carlos", "Ana", "Jorge padre", "Charly", "Angie", "Juan", "Marcos",
  "Abuelo", "Angel", "Tia Mery", "Abigail", "Acompañante", "Jesus", "Adrynis", "Medi",
  "Giuliana", "Rafha", "Angelo", "Abuela Juve", "Angelo A", "Tia Mayrelis", "Duait", "Madrina",
  "Nono", "Tia Eva", "Eva Paola", "Padrino", "Eva felicia", "Tia Lala", "Ivan Artura", "Jovanny",
  "Tia tita", "Sr. Virgilio", "Acompañante", "Sra. Silvia", "Ismariel", "Poti", "Karina", "Eli",
  "Darling", "Tia Dinora", "Lepel", "Elite", "Luis", "Ibarra", "Victor", "Monica",
  "Edmundo", "Marci", "Omar", "Gabo", "Ginna", "Chapel", "Martín", "Gaspar",
  "Hally", "Sebas", "Kimberly", "Antonio", "Juan Abelardo", "Victor", "Elena", "Mainor",
  "Jeffry", "Mainor Junior", "David", "Raiza", "Irving", "Sr.Carlos", "Sr. Roberto", "Elías",
  "Pineda"
];


const guests = async (req, res) => {
  try {
    const db = getFirestore();

    const { guestList } = req.body;

    if (!Array.isArray(guestList)) {
      return res.status(400).json({
        success: false,
        message: "guestList debe ser un arreglo"
      });
    }

    const guestsCollection = db.collection('invitados');

    for (const name of guestList) {
      if (!name || name.trim() === '') continue;

      await guestsCollection.add({
        nombre: name.trim(),
        mensaje: '',
        asistira: null,
        fechaRegistro: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    res.status(200).json({
      success: true,
      message: `${guestList.length} invitados insertados correctamente en Firestore.`
    });

  } catch (error) {
    console.error('Error insertando invitados:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



module.exports = { getAll, getById, usuarios, tabla,login,personal,getpersonal,guests };
