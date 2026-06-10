const exampleService = require('../services/example.service');
const { Pool } = require('pg');
const { getFirestore } = require('../config/firebase');

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
    const { nombre, apellido, role } = req.body;

    const docRef = await db.collection('usuarios').add({
      nombre,
      apellido,
      role,
      user,
      password,
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



const login = async(req,res)=>{
  try{
    const {user,password}=req.body

  }catch(e){

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

module.exports = { getAll, getById, usuarios, tabla };
