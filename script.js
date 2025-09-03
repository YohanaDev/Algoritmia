
const sopa = [
    ['c', 'a', 's', 'a', 'l'],
    ['r', 'o', 'm', 'a', 'r'],
    ['a', 'b', 'c', 'e', 'l'],
    ['z', 'a', 'p', 'a', 't'],
    ['o', 'n', 'a', 'd', 'a']
];

const gridContainer = document.getElementById('word-search-grid');
const wordInput = document.getElementById('word-input');
const searchButton = document.getElementById('search-button');
const resultMessage = document.getElementById('result-message');

function buscarHorizontal(sopa, palabra, fila, columna) {
    const longitudPalabra = palabra.length;
    if (columna + longitudPalabra > sopa[0].length) {
        return false;
    }
    for (let i = 0; i < longitudPalabra; i++) {
        if (sopa[fila][columna + i] !== palabra[i]) {
            return false;
        }
    }
    return true;
}

function buscarVertical(sopa, palabra, fila, columna) {
    const longitudPalabra = palabra.length;
    if (fila + longitudPalabra > sopa.length) {
        return false;
    }
    for (let i = 0; i < longitudPalabra; i++) {
        if (sopa[fila + i][columna] !== palabra[i]) {
            return false;
        }
    }
    return true;
}

function buscarDiagonal(sopa, palabra, fila, columna) {
    const longitudPalabra = palabra.length;
    if (fila + longitudPalabra > sopa.length || columna + longitudPalabra > sopa[0].length) {
        return false;
    }
    for (let i = 0; i < longitudPalabra; i++) {
        if (sopa[fila + i][columna + i] !== palabra[i]) {
            return false;
        }
    }
    return true;
}

function encontrarPalabra(sopa, palabra) {
    const numFilas = sopa.length;
    if (numFilas === 0) return null;
    const numColumnas = sopa[0].length;

    for (let fila = 0; fila < numFilas; fila++) {
        for (let columna = 0; columna < numColumnas; columna++) {
            if (sopa[fila][columna] === palabra[0]) {
                if (buscarHorizontal(sopa, palabra, fila, columna) ||
                    buscarVertical(sopa, palabra, fila, columna) ||
                    buscarDiagonal(sopa, palabra, fila, columna)) {
                    return { fila, columna };
                }
            }
        }
    }

    return null;
}


function renderGrid() {
    gridContainer.innerHTML = ''; 
    sopa.forEach(row => {
        row.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = cell;
            gridContainer.appendChild(cellElement);
        });
    });
    
    if (sopa.length > 0) {
        gridContainer.style.gridTemplateColumns = `repeat(${sopa[0].length}, 1fr)`;
    }
}

function highlightWord(startCoords, palabra) {
    const longitudPalabra = palabra.length;
    const allCells = Array.from(gridContainer.children);

    
    let isHorizontal = buscarHorizontal(sopa, palabra, startCoords.fila, startCoords.columna);
    let isVertical = buscarVertical(sopa, palabra, startCoords.fila, startCoords.columna);
    let isDiagonal = buscarDiagonal(sopa, palabra, startCoords.fila, startCoords.columna);

    for (let i = 0; i < longitudPalabra; i++) {
        let indexToHighlight;
        if (isHorizontal) {
            indexToHighlight = startCoords.fila * sopa[0].length + (startCoords.columna + i);
        } else if (isVertical) {
            indexToHighlight = (startCoords.fila + i) * sopa[0].length + startCoords.columna;
        } else if (isDiagonal) {
            indexToHighlight = (startCoords.fila + i) * sopa[0].length + (startCoords.columna + i);
        }

        if (allCells[indexToHighlight]) {
            allCells[indexToHighlight].classList.add('highlight'); // <-- Solo añade la clase
        }
    }
}
function handleSearch() {
   

    resultMessage.textContent = '';
    resultMessage.classList.remove('found', 'not-found');

    const palabra = wordInput.value.toLowerCase().trim();
    if (palabra.length === 0) {
        resultMessage.textContent = 'Por favor, ingresa una palabra.';
        resultMessage.classList.add('not-found');
        return;
    }

    const resultado = encontrarPalabra(sopa, palabra);

    if (resultado) {
        highlightWord(resultado, palabra);
        resultMessage.textContent = `Palabra "${palabra}" encontrada en [${resultado.fila}, ${resultado.columna}].`;
        resultMessage.classList.add('found');
    } else {
        resultMessage.textContent = `La palabra "${palabra}" no se encontró.`;
        resultMessage.classList.add('not-found');
    }
}


searchButton.addEventListener('click', handleSearch);
wordInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// 
renderGrid();