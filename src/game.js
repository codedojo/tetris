import Grid from './grid.js';
import Piece from './piece.js';

export default class Game {
    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200
    };

    score = 0;
    lines = 0;
    topOut = false;
    activePiece = null;
    nextPiece = null;

    constructor(rows, columns) {
        this._grid = new Grid(rows, columns);

        this._updatePieces();
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
            this._update();
        }
    }

    rotatePiece() {
        this.activePiece.rotate();

        if (this._grid.hasCollision(this.activePiece)) {
            this.activePiece.rotate(false);
        }
    }

    _update() {
        this._updateGrid();
        this._updateScore();
        this._updatePieces();

        if (this._grid.hasCollision(this.activePiece)) {
            this.topOut = true;
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

    _updatePieces() {
        this.activePiece = this.nextPiece ? this.nextPiece : Piece.createPiece();
        this.nextPiece = Piece.createPiece();
        
        this.activePiece.x = Math.floor((this._grid.columns - this.activePiece.width) / 2);
        this.activePiece.y = -1;
    }
}