import Grid from './grid.js';
import Piece from './piece.js';

export default class Game {
    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200
    };

    constructor(rows, columns) {
        this._grid = new Grid(rows, columns);
        this.score = 0;
        this.lines = 0;
        this.topOut = false;
        this.activePiece = null;
        this.nextPiece = null;

        this._updatePiece();
    }

    get level() {
        return Math.floor(this.lines * 0.1);
    }

    get grid() {
        const grid = [];

        for (let y = 0; y < this._grid.rows; y++) {
            grid[y] = [];

            for (let x = 0; x < this._grid.columns; x++) {
                grid[y][x] = this._grid[y][x];
            }
        }

        for (let block of this.activePiece) {
            if (block) {
                grid[block.y][block.x] = block;
            }
        }

        return grid;
    }

    movePieceLeft() {
        this.activePiece.x -= 1;

        if (this._grid.hasCollision(this.activePiece)) {
            this.activePiece.x += 1;
        }
    }

    movePieceRight() {
        this.activePiece.x += 1;

        if (this._grid.hasCollision(this.activePiece)) {
            this.activePiece.x -= 1;
        }
    }

    movePieceDown() {
        if (this.topOut) return;

        this.activePiece.y += 1;

        if (this._grid.hasCollision(this.activePiece)) {
            this.activePiece.y -= 1;
            this._updateGrid();
            this._updateScore();
            this._updatePiece();
        }
    }

    rotatePiece() {
        this.activePiece.rotate();

        if (this._grid.hasCollision(this.activePiece)) {
            this.activePiece.rotate(false);
        }
    }

    _updateGrid() {
        this._grid.lockPiece(this.activePiece);
    }

    _updateScore() {
        const clearedLines = this._grid.clearLines();

        if (clearedLines > 0) {
            this.score += Game.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
        }
    }

    _updatePiece() {
        this.activePiece = this.nextPiece ? this.nextPiece : Piece.createRandomPiece();
        this.nextPiece = Piece.createRandomPiece();
        
        this.activePiece.x = Math.floor((this._grid.columns - this.activePiece.width) / 2);
        this.activePiece.y = -1;

        if (this._grid.hasCollision(this.activePiece)) {
            this.topOut = true;
        }
    }
}