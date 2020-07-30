class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.mine = false;
        this.revealed = false;
        this.mineCount = undefined;
        this.marked = false;
        this.longPressed = false;               // For dealing with long press
    }

    reveal() {
        this.revealed = true;
        if(this.mineCount == 0)
            this.open();
    }

    open() {
        for(let xi=-1; xi<=1; xi++) {
            for(let xj=-1; xj<=1; xj++) {
                let i = this.i + xi;
                let j = this.j + xj;
                if(i>=0 && i<nCells && j>=0 && j<nCells) {
                    let neighbour = board[i][j];
                    if(!neighbour.mine && !neighbour.revealed)
                        neighbour.reveal();
                }
            }
        }
    }

    countMines() {
        if(this.mine)
            return;
        
        let count = 0;
        for(let xi=-1; xi<=1; xi++) {
            for(let xj=-1; xj<=1; xj++) {
                let i = this.i + xi;
                let j = this.j + xj;
                if(i>=0 && i<nCells && j>=0 && j<nCells) {
                    let neighbour = board[i][j];
                    if(neighbour.mine)
                        count++;
                }
            }
        }
        this.mineCount = count;
    }

    display() {
        if(this.revealed) {
            let x = this.j * cDim;
            let y = this.i * cDim;
            if(this.mine) {
                x += cDim/8;
                y += cDim/8;
                ctx.drawImage(mineImg, x, y, cDim*0.75, cDim*0.75);
            }
            else {
                ctx.fillStyle = "#bbbbbb";
                ctx.fillRect(x+1, y+1, cDim-2, cDim-2);
                x += cDim*0.35;
                y += cDim*0.7;
                ctx.fillStyle = "black";
                ctx.font = `800 ${cDim/2}px Arial`;
                if(this.mineCount != 0)
                    ctx.fillText(this.mineCount, x, y);
            }
        }
    }
}
