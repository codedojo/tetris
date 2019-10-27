import Playfield from './playfield.js';
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
        this._playfield = new Playfield(rows, columns);

        this._updatePieces();
    }

    get level() {
        return Math.floor(this.lines * 0.1);
    }

    get playfield() {
        const playfield = [];

        for (let y = 0; y < this._playfield.rows; y++) {
            playfield[y] = [];

            for (let x = 0; x < this._playfield.columns; x++) {
                playfield[y][x] = this._playfield[y][x];
            }
        }

        for (let block of this.activePiece) {
            if (block) {
                playfield[block.y][block.x] = block;
            }
        }

        return playfield;
    }

    movePieceLeft() {
        this.activePiece.x -= 1;

        if (this._playfield.hasCollision(this.activePiece)) {
            this.activePiece.x += 1;
        }
    }

    movePieceRight() {
        this.activePiece.x += 1;

        if (this._playfield.hasCollision(this.activePiece)) {
            this.activePiece.x -= 1;
        }
    }

    movePieceDown() {
        if (this.topOut) return;

        this.activePiece.y += 1;

        if (this._playfield.hasCollision(this.activePiece)) {
            this.activePiece.y -= 1;
            this._update();
        }
    }

    rotatePiece() {
        this.activePiece.rotate();

        if (this._playfield.hasCollision(this.activePiece)) {
            this.activePiece.rotate(false);
        }
    }

    _update() {
        this._updatePlayfield();
        this._updateScore();
        this._updatePieces();

        if (this._playfield.hasCollision(this.activePiece)) {
            this.topOut = true;
        }
    }

    _updatePlayfield() {
        this._playfield.lockPiece(this.activePiece);
    }

    _updateScore() {
        const clearedLines = this._playfield.clearLines();

        if (clearedLines > 0) {
            this.score += Game.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
        }
    }

    _updatePieces() {
        this.activePiece = this.nextPiece ? this.nextPiece : Piece.createPiece();
        this.nextPiece = Piece.createPiece();
        
        this.activePiece.x = Math.floor((this._playfield.columns - this.activePiece.width) / 2);
        this.activePiece.y = -1;
    }
}