let markerTimer, isLongPressed = false;

function handleTouchStart(e) {
    isLongPressed = false;
    markerTimer = setTimeout(function() {
        isLongPressed = true;
        handleMarker(e.touches[0]);
    }, 300);
}

function handleTouchEnd() {
    clearTimeout(markerTimer);
}

function handleClick(e) {
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;
    let i = Math.floor(y/cDim);
    let j = Math.floor(x/cDim);

    if(!board[i][j].marked && !isLongPressed) {
        board[i][j].reveal();

        if(board[i][j].mine) {
            gameLost();
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
    if(e.type == 'contextmenu')
        e.preventDefault();             // Cancel system right-click event
    
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;
    let i = Math.floor(y/cDim);
    let j = Math.floor(x/cDim);

    if(!board[i][j].revealed) {
        board[i][j].marked = !board[i][j].marked;
        minesLeft += board[i][j].marked ? -1 : 1;
        minesCounter.innerHTML = "Mines: " + minesLeft;
        window.navigator.vibrate(10);
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
    canvas.removeEventListener('contextmenu', handleMarker);
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchend', handleTouchEnd);
}