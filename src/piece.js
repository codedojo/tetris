export default class Piece {
    static types = 'IJLOSTZ';

    static createPiece(type) {
        if (!type) {
            const index = Math.floor(Math.random() * this.types.length);
            type = this.types[index];
        }

        switch (type) {
            case 'I': return new Piece('I', [
                [0,0,0,0],
                [1,1,1,1],
                [0,0,0,0],
                [0,0,0,0]
            ]);

            case 'J': return new Piece('J', [
                [0,0,0],
                [1,1,1],
                [0,0,1]
            ]);

            case 'L': return new Piece('L', [
                [0,0,0],
                [1,1,1],
                [1,0,0]
            ]);

            case 'O': return new Piece('O', [
                [0,0,0,0],
                [0,1,1,0],
                [0,1,1,0],
                [0,0,0,0]
            ]);

            case 'S': return new Piece('S', [
                [0,0,0],
                [0,1,1],
                [1,1,0]
            ]);

            case 'T': return new Piece('T', [
                [0,0,0],
                [1,1,1],
                [0,1,0]
            ]);

            case 'Z': return new Piece('Z', [
                [0,0,0],
                [1,1,0],
                [0,1,1]
            ]);

            default: throw new Error('Invalid peice type');
        }
    }

    x = 0;
    y = 0;

    constructor(type, blocks) {
        this.type = type;
        this.blocks = blocks;
    }

    get width() {
        return this.blocks[0].length;
    }

    get height() {
        return this.blocks.length;
    }

    rotate(clockwise = true) {
        const blocks = this.blocks;
        const length = blocks.length;
        const x = Math.floor(length / 2);
        const y = length - 1;

        for (let i = 0; i < x; i++) {
            for (let j = i; j < y - i; j++) {
                let temp = blocks[i][j];

                if (clockwise) {
                    blocks[i][j] = blocks[y - j][i];
                    blocks[y - j][i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[j][y - i]
                    blocks[j][y - i] = temp;
                } else {
                    blocks[i][j] = blocks[j][y - i]; 
                    blocks[j][y-i] = blocks[y - i][y - j]; 
                    blocks[y - i][y - j] = blocks[y - j][i];
                    blocks[y - j][i] = temp;
                }
            }
        }
    }

    *[Symbol.iterator]() {
        for (let y = 0; y < this.blocks.length; y++) {
            for (let x = 0; x < this.blocks[y].length; x++) {
                yield this.blocks[y][x] === 1 ? {
                    x: this.x + x,
                    y: this.y + y,
                    type: this.type
                } : null;
            }
        }
    }
}