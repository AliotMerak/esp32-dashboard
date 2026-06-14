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

// AHORA USAMOS GET: Recibe las variables directamente en la URL
app.get('/api/enviar', (req, res) => {
    // Extraer los parámetros de la URL (ej: ?presion=1012&temperatura=24&datoExtra=50)
    const { presion, temperatura, datoExtra } = req.query;
    
    // Almacenar los datos en la memoria RAM del servidor
    ultimosDatos = {
        presion: presion || "0",
        temperatura: temperatura || "0",
        datoExtra: datoExtra || "0",
        fecha: new Date().toLocaleTimeString()
    };
    
    console.log("¡Datos recibidos con éxito vía GET!", ultimosDatos);
    
    // Responder con éxito al ESP32
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
