const tableroEl = document.getElementById('tablero');
const estadoEl = document.getElementById('estado');
const reiniciarBtn = document.getElementById('reiniciar');

let celdas = Array(9).fill(null);
let turno = 'X';
let colocadas = { X: 0, O: 0 };
let seleccionada = null;
let juegoTerminado = false;

function iniciar() {
    render();
    mostrarEstado(`Turno de ${turno}`);
}

function render() {
    tableroEl.innerHTML = '';
    celdas.forEach((valor, i) => {
        const div = document.createElement('div');
        div.className = 'casilla';
        if (valor) div.classList.add(valor.toLowerCase());
        if (seleccionada === i) div.classList.add('seleccionada');
        div.textContent = valor || '';
        div.onclick = () => clickCasilla(i);
        tableroEl.appendChild(div);
    });
}

function mostrarEstado(mensaje) {
    if (!juegoTerminado) estadoEl.textContent = mensaje;
}

function clickCasilla(i) {
    if (juegoTerminado) return;

    // Mover ficha seleccionada
    if (seleccionada !== null) {
        if (!celdas[i]) {
            celdas[i] = turno;
            celdas[seleccionada] = null;
            seleccionada = null;
            if (verificarGanador()) return;
            cambiarTurno();
        } else {
            seleccionada = null;
            mostrarEstado('Casilla ocupada');
        }
        render();
        return;
    }

    // Colocar nueva ficha
    if (!celdas[i] && colocadas[turno] < 3) {
        celdas[i] = turno;
        colocadas[turno]++;
        if (verificarGanador()) return;
        cambiarTurno();
        return;
    }

    // Seleccionar ficha para mover
    if (celdas[i] === turno && colocadas[turno] === 3) {
        seleccionada = i;
        mostrarEstado(`${turno} seleccionó una ficha. Elige destino.`);
        render();
    }
}

function cambiarTurno() {
    turno = turno === 'X' ? 'O' : 'X';
    render();
    mostrarEstado(`Turno de ${turno}`);
}

function verificarGanador() {
    const combinaciones = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of combinaciones) {
        if (celdas[a] && celdas[a] === celdas[b] && celdas[a] === celdas[c]) {
            mostrarGanador([a, b, c], celdas[a]);
            return true;
        }
    }
    return false;
}

function mostrarGanador(combo, ganador) {
    juegoTerminado = true;
    estadoEl.textContent = `🎉 ¡Gana ${ganador}!`;
    const casillas = tableroEl.children;
    combo.forEach(i => casillas[i].classList.add('ganadora', ganador.toLowerCase()));
}

reiniciarBtn.onclick = () => {
    celdas.fill(null);
    turno = 'X';
    colocadas = { X: 0, O: 0 };
    seleccionada = null;
    juegoTerminado = false;
    iniciar();
};

iniciar();
