const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let board;
const totalMines = 10;

const dim = canvas.width;               // Length of board
const cDim = 30;                        // Length of cell
const nCells = canvas.width / cDim;     // Number of cells (In a row/col)
let start, end, delta;                  // For detecting long press (For mobile)

const mineImg = new Image();
mineImg.src = "assets/mine.png";
const markerImg = new Image();
markerImg.src = "assets/marker.png";

setup();
console.log(board);

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
}

function setup() {
    ctx.lineWidth = 2;
    for(let i=0; i<=dim; i+=cDim){
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(dim, i);
        ctx.moveTo(i, 0);
        ctx.lineTo(i, dim);
        ctx.stroke();
    }

    board = new Array(nCells);
    for(let i=0; i<nCells; i++) {
        board[i] = new Array(nCells);
        for(let j=0; j<nCells; j++) {
            board[i][j] = new Cell(i, j);
        }
    }

    for(let x=0; x<totalMines; x++) {
        let i = Math.floor(Math.random() * nCells);
        let j = Math.floor(Math.random() * nCells);
        if(board[i][j].mine) {
            x--;
            continue;
        }
        board[i][j].mine = true;
    }

    for(let i=0; i<nCells; i++) {
        for(let j=0; j<nCells; j++) {
            board[i][j].countMines();
        }
    }

    canvas.addEventListener("click", handleClick);
    
    if(window.innerWidth > window.innerHeight) {
        canvas.addEventListener('contextmenu', leftClicked);        // For detecting right click
    }
    else {
        canvas.addEventListener("mousedown", startTime);
        canvas.addEventListener("mouseup", endTime);
    }
}
