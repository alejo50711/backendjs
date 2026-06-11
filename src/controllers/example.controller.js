const exampleService = require('../services/example.service');
const { Pool } = require('pg');
const { getFirestore } = require('../config/firebase');
const bcrypt = require('bcrypt');

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
    const hash = await bcrypt.hash(password, 10);

    const docRef = await db.collection('personal').add({
      nombre,
      apellido,
      role,
      user,
      password:hash,
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

const getpersonal = async(req,res)=>{
  try {
    const db = getFirestore();

    const { id } = req.body;

    const snapshot = await db
      .collection('personal')
      .where('idcreador', '==', id)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({
        success: false,
        mensaje: 'empleador no tiene trabajadores'
      });
    }

  

   

    res.json({
      success: true,
     data:snapshot
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
}



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

module.exports = { getAll, getById, usuarios, tabla,login,personal,getpersonal };
