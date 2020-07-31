const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let board;
const images = {};
const totalMines = 30;

const dim = canvas.width;               // Length of board
const cDim = 30;                        // Length of cell
const nCells = canvas.width / cDim;     // Number of cells (In a row/col)

setCanvasSize();
setup();
console.log(board);

function checkWin() {
    let flag = true;
    for(let i=0; i<nCells; i++) {
        for(let j=0; j<nCells; j++) {
            if(!board[i][j].mine && !board[i][j].revealed) {
                flag = false;
                break;
            }
        }
    }
    if(flag) {
        document.getElementById("result").innerHTML = "Game won!";
        canvas.removeEventListener('click', handleClick);
        canvas.removeEventListener('click', handleClickMobile);
        canvas.removeEventListener('contextmenu', handleMarker);
    }
}

function gameOver() {
    for(let i=0; i<nCells; i++) {
        for(let j=0; j<nCells; j++) {
            board[i][j].revealed = true;
        }
    }
}

function display() {
    for(let i=0; i<nCells; i++) {
        for(let j=0; j<nCells; j++) {
            board[i][j].display();
        }
    }
    checkWin();
}

function setup() {
    loadImages();

    // Draw grid
    ctx.lineWidth = 2;
    for(let i=0; i<=dim; i+=cDim){
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(dim, i);
        ctx.moveTo(i, 0);
        ctx.lineTo(i, dim);
        ctx.stroke();
    }

    // Initialize each cell of the board
    board = new Array(nCells);
    for(let i=0; i<nCells; i++) {
        board[i] = new Array(nCells);
        for(let j=0; j<nCells; j++) {
            board[i][j] = new Cell(i, j);
        }
    }

    // Place mines on the board randomly
    for(let x=0; x<totalMines; x++) {
        let i = Math.floor(Math.random() * nCells);
        let j = Math.floor(Math.random() * nCells);
        if(board[i][j].mine) {
            x--;
            continue;
        }
        board[i][j].mine = true;
    }

    // Count neighbouring mines for each cell
    for(let i=0; i<nCells; i++) {
        for(let j=0; j<nCells; j++) {
            board[i][j].countMines();
        }
    }

    // Set user interface based on the system
    if(window.innerWidth > window.innerHeight) {
        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('contextmenu', handleMarker);       // For detecting right click
    }
    else {
        canvas.addEventListener('click', handleClickMobile);
    }

    // Display the board after last image (cell) is loaded
    images['cell'].onload = function() {
        display();
    }
}

function loadImages() {
    images['mine'] = new Image();
    images['mine'].src = "assets/mine.png";
    images['mine_red'] = new Image();
    images['mine_red'].src = "assets/mine_red.png";
    images['mine_wrong'] = new Image();
    images['mine_wrong'].src = "assets/mine_wrong.png";
    
    images['marker'] = new Image();
    images['marker'].src = "assets/marker.png";
    
    images['num'] = new Array(9);
    for(let i=0; i<9; i++) {
        images['num'][i] = new Image();    
        images['num'][i].src = `assets/num${i}.png`;
    }

    images['cell'] = new Image();
    images['cell'].src = "assets/cell.png";
}

function setCanvasSize() {
    if(window.innerWidth < window.innerHeight) {
        nCells = Math.floor((window.innerWidth - 30) / cDim);
        canvas.width = nCells * cDim;
        canvas.height = canvas.width;
        dim = canvas.width;
    }
}
