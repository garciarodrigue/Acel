if ('AbsoluteOrientationSensor' in window && 'Accelerometer' in window) {
    navigator.permissions.query({ name: 'accelerometer' })
        .then(result => {
            if (result.state === 'granted') {
                const barometer = new AbsoluteOrientationSensor({ frequency: 60 });
                const accelerometer = new Accelerometer({ frequency: 60 });

                barometer.addEventListener('reading', () => {
                    document.getElementById('barometerValue').innerText = `Presión atmosférica: ${barometer.pressureZ} hPa`;
                });

                accelerometer.addEventListener('reading', () => {
                    document.getElementById('accelerometerValues').innerText = `
                        lados: ${accelerometer.x.toFixed(2)} m/s²,
                        altuta: ${accelerometer.y.toFixed(2)} m/s²,
                        frente: ${accelerometer.z.toFixed(2)} m/s²
                    `;

                    var frentes = document.getElementById('frentes');
                    var altura = document.getElementById('altura');
                    var lados = document.getElementById('lados');

                    if (Math.abs(accelerometer.x.toFixed()) < 0.1) {
                        lados.textContent = "🔒"; // Posición estática en el eje X
                    } else if (accelerometer.x.toFixed() < -1) {
                        lados.textContent = "🔜"; // Movimiento hacia la izquierda
                    } else if (accelerometer.x.toFixed() > 1) {
                        lados.textContent = "🔙"; // Movimiento hacia la derecha
                    }

                    if (Math.abs(accelerometer.y.toFixed()) < 0.1) {
                        altura.textContent = "🔒"; // Posición estática en el eje Z
                    } else if (accelerometer.y.toFixed() < 0) {
                        altura.textContent = "⬆️"; // Movimiento hacia arriba
                    } else if (accelerometer.y.toFixed() > 0) {
                        altura.textContent = "⬇️"; // Movimiento hacia abajo
                    }

                    if (Math.abs(accelerometer.z.toFixed()) < 0.1) {
                        frentes.textContent = "🔒"; // Posición estática en el eje Z
                    } else if (accelerometer.z.toFixed() < -0.9) {
                        frentes.textContent = "Atras"; // Movimiento hacia atrás
                    } else if (accelerometer.z.toFixed() > 10.12) {
                        frentes.textContent = "Adelante"; // Movimiento hacia adelante
                    } else if (Math.abs(accelerometer.z.toFixed()) < 10.20) {
                        frentes.textContent = "stop"; // Posición estática en el eje Z
                    }
                });

                barometer.start();
                accelerometer.start();
            } else {
                alert('El permiso para acceder al sensor de acelerómetro no está concedido.');
            }
        })
        .catch(error => {
            console.error('Error al verificar los permisos del sensor:', error);
        });
} else {
    alert('El navegador no admite la API de Sensores.');
}

