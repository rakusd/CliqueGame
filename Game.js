const { Board, INVALID, EMPTY, PLAYER1, PLAYER2 } = require('./Board.js');
const { RandomPlayer } = require('./RandomPlayer.js');
const { Mcts } = require('./Mcts.js');
const { AlphaBetaPlayer } = require('./AlphaBetaPlayer.js');

class Game {
    constructor() {
    }

    initGame(config) {
        this.cliqueSize = config.cliqueSize;
        this.verticesCount = config.verticesCount;
        this.board = new Board(this.verticesCount);

        //number of edges
        this.maxMoves = this.verticesCount * (this.verticesCount - 1) / 2;
        // number of edges required to from clique
        this.minMoves = this.cliqueSize * (this.cliqueSize - 1) / 2;
        this.moveCount = 0;
        this.movesHistory = [];
        this.winner = undefined;


        this.player1 = this.initPlayer(config, config.player1, PLAYER1);
        this.player2 = this.initPlayer(config, config.player2, PLAYER2);
        this.humanMove = false;
    }

    initPlayer(gameConfig, playerConfig, playerId) {
        let player;
        switch (playerConfig.type) {
            case 'human':
                player = null;
                break;

            case 'random':
                player = new RandomPlayer(playerConfig);
                break;

            case 'alphaBeta':
                player = new AlphaBetaPlayer(gameConfig.cliqueSize, playerConfig.depth, playerId, playerConfig.advancedStrategy);
                break;

            case 'monteCarlo':
                player = new Mcts(gameConfig.verticesCount, gameConfig.cliqueSize, playerConfig.timeout, playerId);
                break;
        }

        return player;
    }

    startHumanComputerGame() {
        if (this.player1 !== null) {
            let move = this.player.decideMove(null, this.board.copyBoard());
            this.makeMove(move, PLAYER1);
            this.humanId = PLAYER2;
            this.botId = PLAYER1;
            this.botPlayer = this.player1;
        } else {
            this.humanId = PLAYER1;
            this.botId = PLAYER2;
            this.botPlayer = this.player2;
        }
        this.humanMove = true;
    }

    makeHumanPlayerMove(move) {
        if (!this.humanMove) {
            throw 'Bot is thinking!';
        }
        this.humanMove = false; //prevent additional moves to be taken
        try {
            this.makeMove(move, this.humanId);
            if (checkIfPlayerWon(this.humanId)) {
                this.winner = this.humanId;
                return winner;
            }
        } catch (error) {
            console.error(error);
            this.humanMove = true;
            throw 'Invalid move!';
        }

        let botMove = this.botPlayer.decideMove(move, this.board.copyBoard());

        this.board.markMove(move, this.botMove);
        if (checkIfPlayerWon(this.botMove)) {
            this.winner = this.botId;
            return winner;
        }

        return botMove;
    }

    playAutomaticGameOfBots() {
        let lastMove = null;

        while (true) {
            if (!this.canMove()) {
                break;
            }
            lastMove = this.player1.decideMove(lastMove, this.board.copyBoard());
            this.makeMove(lastMove, PLAYER1);
            if (this.checkIfPlayerWon(PLAYER1)) {
                this.winner = PLAYER1;
                return this.winner;
            }

            if (!this.canMove()) {
                break;
            }
            lastMove = this.player2.decideMove(lastMove, this.board.copyBoard());
            this.makeMove(lastMove, PLAYER2);
            if (this.checkIfPlayerWon(PLAYER2)) {
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
        if (this.minMoves > (this.moveCount + 1) / 2) {
            return false;
        }

        return this.board.doesCliqueExist(this.cliqueSize, player);
    }
}

exports.Game = Game;