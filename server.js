const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar la lectura de datos en formato JSON
app.use(express.json());

// Variable global para almacenar el último dato recibido en la memoria RAM
let ultimosDatos = {
    presion: "0",
    temperatura: "0",
    datoExtra: "0",
    fecha: "Esperando datos..."
};

// Ruta 1: El ESP32 enviará sus datos simulados aquí
app.post('/api/datos', (req, res) => {
    const { presion, temperatura, datoExtra } = req.body;
    
    // Guardamos los datos recibidos y añadimos la hora actual del servidor
    ultimosDatos = {
        presion,
        temperatura,
        datoExtra,
        fecha: new Date().toLocaleTimeString()
    };
    
    console.log("Datos recibidos del ESP32:", ultimosDatos);
    res.status(200).json({ mensaje: "Datos guardados con éxito" });
});

// Ruta 2: La página web llamará aquí cada 3 segundos para refrescarse
app.get('/api/datos', (req, res) => {
    res.json(ultimosDatos);
});

// Ruta 3: Servir la página web principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});