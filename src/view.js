export default class View {
    static colors = {
        'I': 'cyan',
        'J': 'blue',
        'L': 'orange',
        'O': 'yellow',
        'S': 'green',
        'T': 'purple',
        'Z': 'red'
    };

    constructor({ element, width, height, rows, columns }) {
        this.element = element;
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.gridBorderWidth = 4;
        this.gridX = this.gridBorderWidth;
        this.gridY = this.gridBorderWidth;
        this.gridWidth = this.width * 2 / 3;
        this.gridHeight = this.height;
        this.gridInnerWidth = this.gridWidth - this.gridBorderWidth * 2;
        this.gridInnerHeight = this.gridHeight - this.gridBorderWidth * 2;

        this.blockWidth = this.gridInnerWidth / columns;
        this.blockHeight = this.gridInnerHeight / rows;

        this.panelX = this.gridWidth + 10;
        this.panelY = 0;
        this.panelWidth = this.width / 3;
        this.panelHeight = this.height;

        this.element.appendChild(this.canvas);
    }

    on(event, handler) {
        document.addEventListener(event, handler);
    }

    renderStartScreen() {
        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
    }

    renderMainScreen(viewModel) {
        this._clearScreen();
        this._renderGrid(viewModel);
        this._renderPanel(viewModel);
        this._renderBorder();
    }

    renderPauseScreen() {
        this._clearScreen('rgba(0, 0, 0, 0.75)');

        this.context.fillStyle = 'white';
        this.context.font = '16px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('PAUSE', this.width / 2, this.height / 2 - 48);
        this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
    }

    renderEndScreen({ score }) {
        this._clearScreen();
        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48);
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
    }

    _clearScreen(color = 'black') {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    _renderBorder() {
        this.context.strokeStyle = 'white';
        this.context.lineWidth = this.gridBorderWidth;
        this.context.strokeRect(0, 0, this.gridWidth, this.gridHeight);
    }

    _renderGrid({ grid }) {
        for (let y = 0; y < grid.length; y++) {
            const line = grid[y];

            for (let x = 0; x < line.length; x++) {
                const block = grid[y][x];
                
                if (block) {
                    this._renderBlock({
                        x: this.gridX + (x * this.blockWidth),
                        y: this.gridY + (y * this.blockHeight),
                        width: this.blockWidth,
                        height: this.blockHeight,
                        color: View.colors[block.type]
                    });
                }
            }
        }
    }

    _renderPanel({ level, score, lines, nextPiece }) {
        this.context.textAlign = 'start';
        this.context.textBaseline = 'top';
        this.context.fillStyle = 'white';
        this.context.font = '14px "Press Start 2P"';

        this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 0);
        this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 24);
        this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 48);
        this.context.fillText('Next:', this.panelX, this.panelY + 96);
        
        this._renderPiece(nextPiece, {
            x: this.panelX,
            y: this.panelY + 120,
            width: this.blockWidth * 0.5,
            height: this.blockHeight * 0.5
        });
    }

    _renderPiece(piece, { x, y, width = this.blockWidth, height = this.blockHeight }) {
        for (let block of piece) {
            if (block) {
                this._renderBlock({
                    x: x + (block.x * width),
                    y: y + (block.y * height),
                    width,
                    height,
                    color: View.colors[block.type]
                });
            }
        }
    }

    _renderBlock({ x, y, width, height, lineWidth = 2, color = 'black' }) {
        this.context.fillStyle = color;
        this.context.strokeStyle = 'black';
        this.context.lineWidth = lineWidth;

        this.context.fillRect(x, y, width, height);
        this.context.strokeRect(x, y, width, height);
    }

    _renderText(string, { x, y, font, color, align, baseline }) {
        if (font) this.context.textAlign = font;
        if (color) this.context.fillStyle = color;
        if (align) this.context.textAlign = align;
        if (baseline) this.context.textBaseline = baseline;

        this.context.fillText(string, x, y);
    }
}