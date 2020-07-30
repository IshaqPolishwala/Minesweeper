function handleClick(e) {
    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;
    let i = Math.floor(y/cDim);
    let j = Math.floor(x/cDim);

    if(!board[i][j].marked && !board[i][j].longPressed) {
        board[i][j].reveal();
        if(board[i][j].mine) {
            gameOver();
            ctx.fillStyle = "#ff1f1f";
            x = j * cDim;
            y = i * cDim;
            ctx.fillRect(x+1, y+1, cDim-2, cDim-2);
            canvas.removeEventListener("click", handleClick);
            canvas.removeEventListener("mousedown", startTime);
            canvas.removeEventListener("mouseup", endTime);
            canvas.removeEventListener('contextmenu', leftClicked); 
        }
    }
    board[i][j].longPressed = false;
    display();
}

function handleMarker(i, j) {
    x = j * cDim;
    y = i * cDim;
    if(!board[i][j].revealed) {
        if(board[i][j].marked) {
            board[i][j].marked = false;
            ctx.clearRect(x+1, y+1, cDim-2, cDim-2);
        }
        else {
            board[i][j].marked = true;
            ctx.drawImage(markerImg, x+cDim/8, y+cDim/8, cDim*0.75, cDim*0.75);
        }
    }
}

function startTime() {
    start = new Date();
}

function endTime(e) {
    end = new Date();
    delta = end - start;

    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;
    let i = Math.floor(y/cDim);
    let j = Math.floor(x/cDim);
    
    if(delta > 400) {
        board[i][j].longPressed = true;
        handleMarker(i, j);
    }
}

function leftClicked(e) {
    e.preventDefault();         // For not displaying context menu which right clicked
    
    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;
    let i = Math.floor(y/cDim);
    let j = Math.floor(x/cDim);
    
    handleMarker(i, j);
}
