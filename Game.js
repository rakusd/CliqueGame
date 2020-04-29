const {Board, INVALID, EMPTY, PLAYER1, PLAYER2} = require('./Board.js');
const {RandomPlayer} = require('./RandomPlayer.js');

class Game {
    constructor() {
    }

    initGame(config) {
        this.cliqueSize = config['cliqueSize'];
        this.verticeCount = config['verticeCount'];
        this.board = new Board(this.verticeCount);

        //number of edges
        this.maxMoves = this.verticeCount * (this.verticeCount - 1) / 2;
        // number of edges required to from clique
        this.minMoves = this.cliqueSize * (this.cliqueSize - 1 ) / 2;
        this.moveCount = 0;
        this.movesHistory = [];
        this.winner = undefined;
        
        this.currentPlayer = config['currentPlayer'];
        if(this.currentPlayer != PLAYER1 && this.currentPlayer != PLAYER2) {
            throw 'Starting player is invalid';
        }

        this.player1 = this.initPlayer(config, config['player1']);
        this.player2 = this.initPlayer(config, config['player2']);
    }

    initPlayer(gameConfig, playerConfig) {
        var player;
        switch(playerConfig['type']) {
            case 'human':
                player = null;
                break;

            case 'random':
                player = new RandomPlayer(playerConfig);
                break;

            case 'alphaBeta':
                break;

            case 'monteCarlo':
                break;
        }

        return player;
    }

    makeHumanPlayerMove(move) {
        // if not currentPlayer == human_player
        // currentPlayer = enemy
        
        // try {
        //     this.makeMove(move, human_player);
        //     if(checkIfPlayerWon(HUMAN_PLAYER)) {
        //         this.winner = HUMAN_PLAYER;
        //         return winner;
        //     }
        // } catch(error) {
        //     console.error(error);
        //     return; //what do u want returned?
        // }

        // bot_move = this.bot1.decideMove();
        
        // this.board.markMove(move, BOT_PLAYER1);
        // if(checkIfPlayerWon(BOT_PLAYER1)) {
        //     this.winner = BOT_PLAYER1;
        //     return;
        // }

    }

    playAutomaticGameOfBots() {
        var lastMove;
        if(this.currentPlayer == PLAYER2) {
            lastMove = this.player2.decideMove(this.board.copyBoard());
            this.makeMove(lastMove, PLAYER2);
        }

        while(true) {
            if(!this.canMove()) {
                break;
            }
            lastMove = this.player1.decideMove(this.board.copyBoard());
            this.makeMove(lastMove, PLAYER1);
            if(this.checkIfPlayerWon(PLAYER1)) {
                this.winner = PLAYER1;
                return this.winner;
            }

            if(!this.canMove()) {
                break;
            }
            lastMove = this.player2.decideMove(this.board.copyBoard());
            this.makeMove(lastMove, PLAYER2);
            if(this.checkIfPlayerWon(PLAYER2)) {
                this.winner = PLAYER2;
                return this.winner;
            }
        }

        // no winner
        return null;
    }

    makeMove(move, player) {
        this.board.markMove(move, player);
        this.movesHistory.push(move);
        this.moveCount++;
    }

    canMove() {
        return this.maxMoves > this.moveCount;
    }

    checkIfPlayerWon(player) {
        if(this.moveCount < this.minMoves) {
            return false;
        }

        return this.board.doesCliqueExist(this.cliqueSize, player);
    }
}

exports.Game = Game;