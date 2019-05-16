export default class Controller {
    constructor(game, view) {
        this._game = game;
        this._view = view;
        this._isPlaying = false;
        this._interval = null;

        this.update = this.update.bind(this);

        view.on('keypress', this._handleKeyPress.bind(this));
        view.on('keydown', this._handleKeyDown.bind(this));
        view.on('keyup', this._handleKeyUp.bind(this));

        this._view.renderStartScreen();
    }

    update() {
        this._game.moveDown();
        this._updateView();
    }

    play() {
        this._isPlaying = true;
        this._startTimer();
        this._updateView();
    }

    pause() {
        this._isPlaying = false;
        this._stopTimer();
        this._updateView();
    }

    _updateView() {
        const state = this._game.state;
        
        if (state.isGameOver) {
            this._view.renderEndScreen(state);
        } else if (!this._isPlaying) {
            this._view.renderPauseScreen(state);
        } else {
            this._view.renderMainScreen(state);
        }
    }

    _startTimer() {
        const speed = 1000 - this._game.state.level * 100;
        
        if (!this._interval) {
            this._interval = setInterval(() => {
                this.update()
            }, speed > 0 ? speed : 100);
        }
    }

    _stopTimer() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    _handleKeyPress(event) {
        switch (event.keyCode) {
            case 13: // ENTER
                if (this._isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
        }
    }

    _handleKeyDown(event) {
        switch (event.keyCode) {
            case 37: // LEFT ARROW
                this._game.moveLeft();
                this._updateView();
                break;
            case 38: // UP ARROW
                this._game.rotate();
                this._updateView();
                break;
            case 39: // RIGHT ARROW
                this._game.moveRight();
                this._updateView();
                break;
            case 40: // DOWN ARROW
                this._stopTimer();
                this._game.moveDown();
                this._updateView();
                break;
        }
    }

    _handleKeyUp(event) {
        switch (event.keyCode) {
            case 40: // DOWN ARROW
                this._startTimer();
                break;
        }
    }
}