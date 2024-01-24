// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCqGiUg3Oi8z_0gh3-hxSrJWyUatEiVkts",
    authDomain: "doxdog-68f97.firebaseapp.com",
    databaseURL: "https://doxdog-68f97-default-rtdb.firebaseio.com",
    projectId: "doxdog-68f97",
    storageBucket: "doxdog-68f97.appspot.com",
    messagingSenderId: "64728146009",
    appId: "1:64728146009:web:9d40a62dc002da845fd148"
};

firebase.initializeApp(firebaseConfig);

// Referencia a la base de datos en tiempo real de Firebase
const database = firebase.database();

// Verificar si el navegador admite la API de Sensores
if ('AbsoluteOrientationSensor' in window && 'Accelerometer' in window) {
    const barometer = new AbsoluteOrientationSensor({ frequency: 60 });
    const accelerometer = new Accelerometer({ frequency: 60 });

    // Manejar lecturas del sensor de barómetro
    barometer.addEventListener('reading', () => {
        document.getElementById('barometerValue').innerText = `Presión atmosférica: ${barometer.pressureZ} hPa`;
    });

    // Manejar lecturas del sensor de acelerómetro
    accelerometer.addEventListener('reading', () => {
        document.getElementById('accelerometerValues').innerText = `
            Aceleración X: ${accelerometer.x.toFixed(2)} m/s²,
            Aceleración Y: ${accelerometer.y.toFixed(2)} m/s²,
            Aceleración Z: ${accelerometer.z.toFixed(2)} m/s²
        `;
        
        var frentes = document.getElementById('frentes');
        var altura = document.getElementById('altura');
        var lados = document.getElementById('lados');
        
        const threshold = 0.1;

        if (Math.abs(accelerometer.x.toFixed()) < threshold) {
            lados.textContent = "🔒"; // Posición estática en el eje X
        } else if (accelerometer.x.toFixed() < 0) {
            lados.textContent = "🔜"; // Movimiento hacia la izquierda
        } else if (accelerometer.x.toFixed() > 0) {
            lados.textContent = "🔙"; // Movimiento hacia la derecha
        }

        if (Math.abs(accelerometer.z.toFixed()) < threshold) {
            altura.textContent = "🔒"; // Posición estática en el eje Z
        } else if (accelerometer.z.toFixed() < 0) {
            altura.textContent = "⬆️"; // Movimiento hacia arriba
        } else if (accelerometer.z.toFixed() > 0) {
            altura.textContent = "⬇️"; // Movimiento hacia abajo
        }

        if (Math.abs(accelerometer.z.toFixed()) < threshold) {
            frentes.textContent = "🔒"; // Posición estática en el eje Z
        } else if (accelerometer.z.toFixed() < -0.9) {
            frentes.textContent = "Atras"; // Movimiento hacia atrás
        } else if (accelerometer.z.toFixed() > 0.9) {
            frentes.textContent = "Adelante"; // Movimiento hacia adelante
        } else if (Math.abs(accelerometer.z.toFixed()) < 0.5) {
            frentes.textContent = "stop"; // Posición estática en el eje Z
        }

        // Obtén datos del acelerómetro
        const data = {
            accelerationX: accelerometer.x.toFixed(2),
            accelerationY: accelerometer.y.toFixed(2),
            accelerationZ: accelerometer.z.toFixed(2)
        };

        // Envía datos a la base de datos en tiempo real de Firebase
        database.ref('sensorData').set(data);
    });

    // Comenzar la lectura de sensores
    barometer.start();
    accelerometer.start();
} else {
    alert('El navegador no admite la API de Sensores.');
}

