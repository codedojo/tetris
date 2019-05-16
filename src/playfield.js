export default class Playfield {
    _grid = [];
    _piece = null;

    constructor(height, width, piece) {
        for (let y = 0; y < height; y++) {
            this._grid[y] = new Array(width).fill(0);
        }

        this.piece = piece;
    }

    get width() {
        return this._grid[0].length;
    }

    get height() {
        return this._grid.length;
    }

    get state() {
        const grid = [];

        for (let y = 0; y < this.height; y++) {
            grid[y] = [];

            for (let x = 0; x < this.width; x++) {
                grid[y][x] = this._grid[y][x];
            }
        }

        for (let block of this._piece) {
            if (block) {
                grid[block.y][block.x] = block;
            }
        }

        return grid;
    }

    set piece(piece) {
        this._piece = piece;
        this._piece.x = Math.floor((this.width - this._piece.width) / 2);
        this._piece.y = -1;
    }

    movePieceLeft() {
        this._piece.x -= 1;

        if (this.hasCollision()) {
            this._piece.x += 1;
            return false;
        }

        return true;
    }

    movePieceRight() {
        this._piece.x += 1;

        if (this.hasCollision()) {
            this._piece.x -= 1;
            return false;
        }

        return true;
    }

    movePieceDown() {
        this._piece.y += 1;

        if (this.hasCollision()) {
            this._piece.y -= 1;
            return false;
        }

        return true;
    }

    rotatePiece() {
        this._piece.rotate();

        if (this.hasCollision()) {
            this._piece.rotate(false);
            return false;
        }

        return true;
    }

    hasCollision() {
        for (let block of this._piece) {
            if (
                block && 
                (this._isOutOfBounds(block.x, block.y) || this._isOccupied(block.x, block.y))
            ) {
                return true;
            }
        }

        return false;
    }

    lockPiece() {
        for (let block of this._piece) {
            if (block) {
                this._grid[block.y][block.x] = block;
            }
        }
    }

    clearLines() {
        const linesToRemove = this._getLinesToRemove();

        return this._removeLines(linesToRemove);
    }

    _getLinesToRemove() {
        let lines = [];

        for (let y = this.height - 1; y >= 0; y--) {
            let numberOfBlocks = 0;

            for (let x = 0; x < this.width; x++) {
                if (this._grid[y][x]) {
                    numberOfBlocks += 1;
                }
            }

            if (numberOfBlocks === 0) {
                break;
            } else if (numberOfBlocks < this.width) {
                continue;
            } else if (numberOfBlocks === this.width) {
                lines.unshift(y);
            }
        }

        return lines;
    }

    _removeLines(lines) {
        for (let index of lines) {
            this._grid.splice(index, 1);
            this._grid.unshift(new Array(this.width).fill(0));
        }

        return lines.length;
    }

    _isOutOfBounds(x, y) {
        return this._grid[y] === undefined || this._grid[y][x] === undefined;
    }

    _isOccupied(x, y) {
        return this._grid[y][x];
    }

    *[Symbol.iterator]() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                yield this._grid[y][x];
            }
        }
    }
}