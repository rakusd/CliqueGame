class AlphaBeta {
    constructor(depth, evaluation, me, enemy) {
        this.depth = depth;
        this.evaluation = evaluation;
        this.me = me;
        this.enemy = enemy;
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

        let maximizingPlayer = True;
        let bestMove;
        let bestValue = -Infinity;

        for(let move of possibleMoves) {
            value = this._evalMove(board, move, this.depth, maximizingPlayer, alpha, beta, True); // TODO: Pass params
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
        // if enemy won
        // return -Infinity
        
        // if player won
        // return Infinity

        if(depth == 0) {
            return this.evaluation(board);
        }

        if(maximizingPlayer) {
            for(move of board.getPossibleMoves()) {
                value = Math.max(value, this._evalMove(board, move, depth,
                    maximizingPlayer, alpha, beta, False));
                alpha = Math.max(alpha ,value);
            }
        } else {

        }
    }
}
