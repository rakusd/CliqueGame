class AlphaBeta {
    constructor(depth, evaluation, me, enemy, cliqueSize) {
        this.depth = depth;
        this.evaluation = evaluation;
        this.me = me;
        this.enemy = enemy;
        this.cliqueSize = cliqueSize;
        this.minMoves = this.cliqueSize * (this.cliqueSize - 1) / 2;
    }

    _getPlayer(takeMe = true) {
        if(takeMe) {
            return this.me;
        }
        return this.enemy;
    }

    getMovesEval(board) {
        let possibleMoves = board.getPossibleMoves();
        let alpha = -Infinity;
        let beta = Infinity;

        let maximizingPlayer = true;
        let bestMove;
        let bestValue = -Infinity;

        for(let move of possibleMoves) {
            let value = this._evalMove(board, move, this.depth, maximizingPlayer, alpha, beta, true); // TODO: Pass params
            if(value >= bestValue) {
                bestValue = value;
                bestMove = move;
            }
            alpha = Math.max(value, alpha);
        }
        
        return bestMove;
    }

    _evalMove(board, move, depth, maximizingPlayer, alpha, beta, isFirstStep) {
        let newBoard = board.copyBoard();
        newBoard.markMove(move, this._getPlayer(maximizingPlayer));
        depth -= 1;
        maximizingPlayer = !maximizingPlayer;
        
        return this._alphaBeta(newBoard, depth, maximizingPlayer, alpha, beta, isFirstStep);
    }

    _alphaBeta(board, depth, maximizingPlayer, alpha, beta, isFirstStep) {
        if(maximizingPlayer) {
            // last move was done by enemy
            if(this._checkIfPlayerWon(board, this.enemy)) {
                return -Infinity;
            }
        } else {
            // last move was done by me
            if(this._checkIfPlayerWon(board, this.me)) {
                return Infinity;
            }
        }
        
        if(depth == 0) {
            return this.evaluation(board);
        }

        let value;

        if(maximizingPlayer) {
            value = -Infinity;
            for(let move of board.getPossibleMoves()) {
                value = Math.max(value, this._evalMove(board, move, depth,
                    maximizingPlayer, alpha, beta, false));
                alpha = Math.max(alpha, value);

                if (this._shouldCut(alpha, beta, isFirstStep)) {
                    break;
                }
            }
            return value;
        } else {
            value = Infinity;
            for(let move of board.getPossibleMoves()) {
                value = Math.min(value, this._evalMove(board, move, depth,
                    maximizingPlayer, alpha, beta, false));
                beta = Math.min(beta, value);
                
                if (this._shouldCut(alpha, beta, isFirstStep)) {
                    break;
                }
            }
            return value;
        }
    }

    _checkIfPlayerWon(board, player) {
        if(this.minMoves > (board.moveCount+1)/2 ) {
            return false;
        } else {
            return board.doesCliqueExist(this.cliqueSize, player);
        }
    }

    _shouldCut(alpha, beta, isFirstStep) {
        return alpha >= beta;
    }
}

exports.AlphaBeta = AlphaBeta;