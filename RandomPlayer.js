class RandomPlayer {
    constructor(playerConfig) {

    }

    decideMove(boardCopy) {
        var moves = boardCopy.getPossibleMoves();
        var randomMove = moves[Math.floor(Math.random() * moves.length)];

        return randomMove;
    }
}

exports.RandomPlayer = RandomPlayer;