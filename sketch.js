const minesCounter = document.getElementById("minesCounter");
const result = document.getElementById("result");
const timeCounter = document.getElementById("time");
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let board, gameFinished, minesLeft, timeElapsed, timer;
const images = {};
let width, height, cDim = 35;                           // Length of board & cell

setElements();                                          // Set according to device

const nRows = height / cDim;                            // Number of cells in a row
const nCols = width / cDim;                             // Number of cells in a column
const totalMines = Math.floor(nRows*nCols / 7);         // 1 out 7 cells will contain a mine

loadImages();
setup();

result.addEventListener('click', function() {
    if(gameFinished || confirm("New game?"))
        setup();
});

function checkWin() {
    let flag = true, cell;
    for(let i=0; i<nRows; i++) {
        for(let j=0; j<nCols; j++) {
            cell = board[i][j];
            if(cell.mine && !cell.marked || !cell.mine && !cell.revealed) {
                    flag = false;
                    break;
            }
        }
    }
    if(flag) {
        clearInterval(timer);
        result.src = images['smiley_won'];
        gameFinished = true;
        removeAllEvents();
    }
}

function gameOver() {
    clearInterval(timer);
    gameFinished = true;
    result.src = images['smiley_lost'];
    for(let i=0; i<nRows; i++) {
        for(let j=0; j<nCols; j++) {
            board[i][j].revealed = true;
        }
    }
    removeAllEvents();
}

function display() {
    for(let i=0; i<nRows; i++) {
        for(let j=0; j<nCols; j++) {
            board[i][j].display();
        }
    }
}

function setup() {
    clearInterval(timer);

    minesLeft = totalMines;
    minesCounter.innerHTML = "Mines: " + minesLeft;

    timeElapsed = 0;
    timeCounter.innerHTML = "Time: " + timeElapsed;

    result.src = images['smiley'];
    gameFinished = false;

    // Draw grid
    ctx.lineWidth = 2;
    for(let i=0; i<=height; i+=cDim){
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }
    for(let i=0; i<=width; i+=cDim){
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }

    // Initialize each cell of the board
    board = new Array(nRows);
    for(let i=0; i<nRows; i++) {
        board[i] = new Array(nCols);
        for(let j=0; j<nCols; j++) {
            board[i][j] = new Cell(i, j);
        }
    }

    // Place mines on the board randomly
    for(let x=0; x<totalMines; x++) {
        let i = Math.floor(Math.random() * nRows);
        let j = Math.floor(Math.random() * nCols);
        if(board[i][j].mine) {
            x--;
            continue;
        }
        board[i][j].mine = true;
    }

    // Count neighbouring mines for each cell
    for(let i=0; i<nRows; i++) {
        for(let j=0; j<nCols; j++) {
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

    canvas.addEventListener('click', startTimer);

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

function setElements() {
    let eWidth = window.innerWidth > window.innerHeight ? 500 : (window.innerWidth - 30);
    width = Math.floor(eWidth / cDim) * cDim;

    let eHeight = window.innerWidth > window.innerHeight ? 500 : (window.innerHeight - 200);
    height = Math.floor(eHeight / cDim) * cDim;
    
    canvas.width = width;
    canvas.height = height;

    let header_container = document.getElementById("header-container").style;
    header_container.marginLeft = canvas.offsetLeft.toString() + "px";
    header_container.width = width.toString() + "px";

    minesCounter.style.fontSize = (width/15).toString() + "px";
    minesCounter.style.left = (canvas.offsetLeft+30).toString() + "px";

    result.width = width/5;

    timeCounter.style.fontSize = (width/15).toString() + "px";
    timeCounter.style.right = (canvas.offsetLeft+30).toString() + "px";
}
