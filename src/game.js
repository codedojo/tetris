import Playfield from './playfield.js';
import Piece from './piece.js';

export default class Game {
    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200
    };

    _score = 0;
    _lines = 0;
    _topOut = false;
    _nextPiece = null;

    constructor(rows, columns) {
        this._playfield = new Playfield(rows, columns, Piece.create());
        this._nextPiece = Piece.create();
    }

    get state() {
        return {
            score: this._score,
            lines: this._lines,
            level: Math.floor(this._lines * 0.1),
            playfield: this._playfield.state,
            nextPiece: this._nextPiece,
            isGameOver: this._topOut
        };
    }

    moveLeft() {
        this._playfield.movePieceLeft();
    }

    moveRight() {
        this._playfield.movePieceRight();
    }

    moveDown() {
        if (!this._playfield.movePieceDown()) {
            this._update();
        }
    }

    rotate() {
        this._playfield.rotatePiece();
    }

    _update() {
        this._updateGrid();
        this._updateScore();
        this._updatePieces();

        if (this._playfield.hasCollision()) {
            this.topOut = true;
        }
    }

    _updateGrid() {
        this._playfield.lockPiece();
    }

    _updateScore() {
        const clearedLines = this._playfield.clearLines();

        if (clearedLines > 0) {
            this._score += Game.points[clearedLines] * (this._level + 1);
            this._lines += clearedLines;
        }
    }

    _updatePieces() {
        this._playfield.piece = this._nextPiece;
        this._nextPiece = Piece.create();
    }
}