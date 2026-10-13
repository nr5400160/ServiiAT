const express = require('express');
const cors = require('cors'); 
const app = express();


app.use(cors({
  origin: 'http://localhost:5175', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/api/servicios', (req, res) => {
  res.json({ mensaje: "CORS configurado exitosamente" });
});

app.listen(3000, () => console.log("Servidor con CORS en puerto 3000"));