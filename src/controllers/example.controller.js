const exampleService = require('../services/example.service');
const { Pool } = require('pg');
const admin = require('../config/firebase');

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
  host: 'dpg-d8kp97egvqtc73fls090-a.oregon-postgres.render.com',
  port: 5432,
  database: 'bdpracticas_5l59',
  user: 'bdpracticas_5l59_user',
  password: 'FslpBss8Q4RNk03EVczEfpHpBCqED1Na',
  ssl: {
    rejectUnauthorized: false
  }
});


const usuarios  =async  (req, res) => {
  const db = admin.firestore();
  
  try {
    const { nombre, apellido, role } = req.body;

    const docRef = await db.collection('usuarios').add({
      nombre,
      apellido,
      role,
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


const tabla = async (req,res)=>{
  try {
    const result = await pool.query('SELECT NOW()');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        apellido VARCHAR(100),
        role VARCHAR(50),
        creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    res.json({
      ok: true,
    });    
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

module.exports = { getAll, getById,usuarios,tabla };
