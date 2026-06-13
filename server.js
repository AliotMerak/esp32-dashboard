const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// OBLIGATORIO: Permitir que Express entienda el texto JSON que manda el ESP32
app.use(express.json());

// Almacenamiento temporal en la memoria RAM del servidor
let ultimosDatos = {
    presion: "0",
    temperatura: "0",
    datoExtra: "0",
    fecha: "Esperando transmisión del ESP32..."
};

// Mapear la ruta que el ESP32 usará mediante POST
app.post('/api/datos', (req, res) => {
    const { presion, temperatura, datoExtra } = req.body;
    
    // Almacenar las variables procesadas
    ultimosDatos = {
        presion: presion || "0",
        temperatura: temperatura || "0",
        datoExtra: datoExtra || "0",
        fecha: new Date().toLocaleTimeString()
    };
    
    console.log("Transmisión recibida con éxito:", ultimosDatos);
    
    // Responder con éxito para que el ESP32 marque Código 200
    res.status(200).json({ estatus: "OK" });
});

// Mapear la ruta que el navegador usará mediante GET cada 3 segundos
app.get('/api/datos', (req, res) => {
    res.json(ultimosDatos);
});

// Servir la interfaz visual HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar la escucha en el puerto asignado por Render
app.listen(PORT, () => {
    console.log(`API en línea y escuchando en el puerto ${PORT}`);
});
