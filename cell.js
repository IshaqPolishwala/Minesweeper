class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.mine = false;
        this.revealed = false;
        this.mineCount = undefined;
        this.marked = false;
    }

    reveal() {
        this.revealed = true;
        if(this.mineCount == 0)
            this.open();
        if(this.marked)
            this.revealed = false;
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
        let x = this.j * cDim;
        let y = this.i * cDim;
        
        if(!this.revealed) {
            if(this.marked)
                ctx.drawImage(images['marker'], x+1, y+1, cDim-2, cDim-2);
            else
                ctx.drawImage(images['cell'], x+1, y+1, cDim-2, cDim-2);
        }
        else {
            if(this.mine)
                ctx.drawImage(images['mine'], x+1, y+1, cDim-2, cDim-2);
            else if(this.marked)
                ctx.drawImage(images['mine_wrong'], x+1, y+1, cDim-2, cDim-2);
            else
                ctx.drawImage(images['num'][this.mineCount], x+1, y+1, cDim-2, cDim-2);
        }
    }
}
