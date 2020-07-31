let clicks = 0, timer = null;
let start,end;
function handleClickMobile(e) {             // (Single-click => Reveal) (Double-click => Handle marker)
    clicks++;
    if(clicks == 1) {
        start=new Date();
        timer = setTimeout(function() {
            handleClick(e);
            clicks = 0;
        }, 200);
    }
    else {
        end=new Date();
        document.getElementById("test").innerHTML = end-start;
        clearTimeout(timer);
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
            ctx.fillStyle = "#ff1f1f";
            x = j * cDim;
            y = i * cDim;
            ctx.fillRect(x+1, y+1, cDim-2, cDim-2);
            canvas.removeEventListener('click', handleClick);
            canvas.removeEventListener('click', handleClickMobile);
            canvas.removeEventListener('contextmenu', handleMarker); 
        }
    }
    display();
}

function handleMarker(e) {
    e.preventDefault();         // For not displaying context menu which right clicked
    
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;
    let i = Math.floor(y/cDim);
    let j = Math.floor(x/cDim);
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
