let clicks = 0, clickTimer;

function handleClickMobile(e) {             // (Single-click => Reveal) (Double-click => Handle marker)
    clicks++;
    if(clicks == 1) {
        clickTimer = setTimeout(function() {
            handleClick(e);
            clicks = 0;
        }, 200);
    }
    else {
        clearTimeout(clickTimer);
        handleMarker(e);
        clicks = 0;
    }
}

function handleClick(e) {
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;
    let i = Math.floor(y/cDim);
    let j = Math.floor(x/cDim);

    if(!board[i][j].marked) {
        board[i][j].reveal();

        if(board[i][j].mine) {
            gameOver();
            display();
            x = j * cDim;
            y = i * cDim;
            ctx.drawImage(images['mine_red'], x+1, y+1, cDim-2, cDim-2);
            return;
        }
    }
    
    display();
    checkWin();
}

function handleMarker(e) {
    e.preventDefault();             // Cancel system right-click event
    
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;
    let i = Math.floor(y/cDim);
    let j = Math.floor(x/cDim);

    if(!board[i][j].revealed) {
        board[i][j].marked = !board[i][j].marked;
        minesLeft += board[i][j].marked ? -1 : 1;
        minesCounter.innerHTML = "Mines: " + minesLeft;
    }
        
    display();
    checkWin();
}

function startTimer() {
    timer = setInterval(function() {
        timeElapsed += 1;
        timeCounter.innerHTML = "Time: " + timeElapsed;
    }, 1000);

    canvas.removeEventListener('click', startTimer);
}

function removeAllEvents() {
    canvas.removeEventListener('click', handleClick);
    canvas.removeEventListener('click', handleClickMobile);
    canvas.removeEventListener('contextmenu', handleMarker);
}