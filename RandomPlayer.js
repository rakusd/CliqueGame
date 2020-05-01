class RandomPlayer {
    constructor(playerConfig) {

    }

    decideMove(_, boardCopy) {
        let moves = boardCopy.getPossibleMoves();
        let randomMove = moves[Math.floor(Math.random() * moves.length)];

        return randomMove;
    }
}

exports.RandomPlayer = RandomPlayer;