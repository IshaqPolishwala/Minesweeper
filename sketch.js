const canvas = document.getElementById("myCanvas");
const result = document.getElementById("result");
const ctx = canvas.getContext("2d");

let board, gameFinished;
const images = {};
const cDim = 30;                                        // Length of cell

setCanvasSize();

const dim = canvas.width;                               // Length of board
const nCells = canvas.width / cDim;                     // Number of cells (In a row/col)
const totalMines = Math.floor(nCells*nCells / 7);       // 1 out 7 cells will contain a mine

loadImages();
setup();

result.addEventListener('click', function() {
    if(gameFinished || confirm("New game?"))
        setup();
});

function checkWin() {
    let flag = true, cell;
    for(let i=0; i<nCells; i++) {
        for(let j=0; j<nCells; j++) {
            cell = board[i][j];
            if(cell.mine && !cell.marked || !cell.mine && !cell.revealed) {
                    flag = false;
                    break;
            }
        }
    }
    if(flag) {
        gameFinished = true;
        result.src = images['smiley_won'];
        canvas.removeEventListener('click', handleClick);
        canvas.removeEventListener('click', handleClickMobile);
        canvas.removeEventListener('contextmenu', handleMarker);
    }
}

function gameOver() {
    gameFinished = true;
    result.src = images['smiley_lost'];
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
    result.src = images['smiley'];
    gameFinished = false;

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

    display();
    console.log(board);             // Can use this as a cheat XD
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

    images['smiley'] = new Image();
    images['smiley'] = "assets/smiley.png";
    images['smiley_won'] = new Image();
    images['smiley_won'] = "assets/smiley_won.png";
    images['smiley_lost'] = new Image();
    images['smiley_lost'] = "assets/smiley_lost.png";

    images['cell'] = new Image();
    images['cell'].src = "assets/cell.png";

    // Display the board after last image (cell) is loaded
    images['cell'].onload = function() {
        result.src = images['smiley'];
        display();
    }
}

function setCanvasSize() {
    let eWidth = window.innerWidth > window.innerHeight ? 500 : (window.innerWidth - 30);
    let n = Math.floor(eWidth / cDim);
    canvas.width = n * cDim;
    canvas.height = n * cDim;
    result.width = canvas.width / 6;
}
