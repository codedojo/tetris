export default class Piece {
    static createPiece(type) {
        switch (type) {
            case 'I': return new Piece('I', 'cyan', [
                [0,0,0,0],
                [1,1,1,1],
                [0,0,0,0],
                [0,0,0,0]
            ]);

            case 'J': return new Piece('J', 'blue', [
                [0,0,0],
                [1,1,1],
                [0,0,1]
            ]);

            case 'L': return new Piece('L', 'orange', [
                [0,0,0],
                [1,1,1],
                [1,0,0]
            ]);

            case 'O': return new Piece('O', 'yellow', [
                [0,0,0,0],
                [0,1,1,0],
                [0,1,1,0],
                [0,0,0,0]
            ]);

            case 'S': return new Piece('S', 'green', [
                [0,0,0],
                [0,1,1],
                [1,1,0]
            ]);

            case 'T': return new Piece('T', 'purple', [
                [0,0,0],
                [1,1,1],
                [0,1,0]
            ]);

            case 'Z': return new Piece('Z', 'red', [
                [0,0,0],
                [1,1,0],
                [0,1,1]
            ]);

            default: throw new Error('Invalid peice type');
        }
    }

    static createRandomPiece() {
        const types = 'IJLOSTZ';
        const index = Math.floor(Math.random() * types.length);
    
        return Piece.createPiece(types[index]);
    }

    constructor(type, color, blocks) {
        this.type = type,
        this.color = color;
        this.blocks = blocks;
        this.x = 0;
        this.y = 0;
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
                    color: this.color
                } : null;
            }
        }
    }
}