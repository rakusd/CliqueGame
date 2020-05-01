const { PLAYER1, PLAYER2 } = require('./Board.js');
class Mcts {
    constructor(verticesCount, cliqueSize, timeout, botNumber) {
        this.verticesCount = verticesCount;
        this.cliqueSize = cliqueSize;
        this.timeout = timeout;
        this.botId = botNumber;

        if (this.botId === PLAYER1) {
            this.opponentId = PLAYER2;
        }
        else {
            this.opponentId = PLAYER1;
        }
    }

    decideMove(lastMove, boardCopy) {
        this.node = this._getNode(lastMove)
        const start = new Date().getTime();
        while (new Date().getTime() - start < this.timeout) {
            let node = this.node;
            const board = boardCopy.copyBoard();

            //selection # keep going down the tree based on best UCB values until terminal or unexpanded node
            while (node.untriedMoves.length === 0 && node.childNodes.length > 0) {
                node = node.selection();
                const id = node.myMove ? this.botId : this.opponentId;
                board.markMove(node.move, id);
            }
            //expand
            if (node.untriedMoves.length > 0) {//jeśli istnieja ruchy nie sprawdzone wychodzace z tego noda
                const move = this._selectRandom(node.untriedMoves);
                node.untriedMoves = this._removeMove(node.untriedMoves, move);
                const id = node.myMove ? this.opponentId : this.botId;
                board.markMove(move, id);
                const currNode = node;
                node = new Node(move, currNode, board.getPossibleMoves(), !currNode.myMove);
                currNode.childNodes.push(node);
            }
            //rollout
            let playerId = node.myMove ? this.botId : this.opponentId;
            let result = board.doesCliqueExist(this.cliqueSize, playerId);
            let possibleMoves = board.getPossibleMoves();
            while (result === false && possibleMoves.length > 0) {
                playerId = playerId === this.botId ? this.opponentId : this.botId;
                let randomMove = this._selectRandom(possibleMoves);
                board.markMove(randomMove, playerId);
                result = board.doesCliqueExist(this.cliqueSize, playerId);
                possibleMoves = this._removeMove(possibleMoves, randomMove);
            }
            //backpropagate
            const iWon = playerId === this.botId;
            while (node !== null) {
                node.update(result, iWon);
                node = node.parent;
            }
        }

        let foo = (x) => x.wins / x.visits;
        let bestNode = this.node.childNodes.reduce((prev, current) => (foo(prev) > foo(current)) ? prev : current);
        console.log("### percentages ####");
        this._printStats(this.node.childNodes);
        this.node = bestNode;
        bestNode.parent = null;

        return bestNode.move;
    }

    _printStats(nodes) {
        const stats = []
        for (const child of nodes) {
            stats.push({
                "move": child.move,
                "wins": child.wins,
                "visits": child.visits,
                "perc": child.wins / child.visits
            })
        }
        stats.sort((a, b) => (b.perc > a.perc) ? 1 : -1)
        let i = 0;
        for (const s of stats) {
            console.log(`${++i} - [${s.move[0]}, ${s.move[1]}] wins: ${s.wins}, visits: ${s.visits}, perc: ${roundNum(s.perc, 2)}`);
        }
    }

    _getAllMoves() {
        let movesList = [];

        for (let i = 0; i < this.verticesCount; i++) {
            for (let j = i + 1; j < this.verticesCount; j++) {
                movesList.push([i, j]);
            }
        }

        return movesList;
    }

    _getNode(lastMove) {
        if (lastMove === null) {
            return new Node(null, null, this._getAllMoves(), false)
        } else if (this.node === null) {
            moves = this._getAllMoves();
            moves = this._removeMove(moves, lastMove);
            return new Node(lastMove, null, moves, false);
        }
        else {
            for (const child of this.node.childNodes) {
                if (this._movesEqual(child.move, lastMove)) {
                    return child;
                }
            }
            moves = this._removeMove(this.node.untriedMoves, lastMove);
            return new Node(lastMove, this.node, moves, false)
        }

    }

    _removeMove(moves, move) {
        const newMoves = [];
        for (const m of moves) {
            if (!this._movesEqual(m, move)) {
                newMoves.push(m)
            }
        }
        return newMoves;
    }
    _movesEqual(a, b) {
        return (a[0] === b[0] && a[1] === b[1]) || (a[1] === b[0] && a[0] === b[1])
    }

    _selectRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }


}

class Node {
    constructor(move, parent, untriedMoves, maximize) {
        this.parent = parent;
        this.untriedMoves = untriedMoves;
        this.childNodes = [];
        this.wins = 0;
        this.lost = 0;
        this.visits = 0;
        this.move = move;
        this.myMove = maximize;
    }
    ucb() {
        if (this.myMove) {
            return this.wins / this.visits + Math.sqrt(2 * Math.log(this.parent.visits) / this.visits);
        }
        else {
            return this.lost / this.visits + Math.sqrt(2 * Math.log(this.parent.visits) / this.visits);
        }
    }

    selection() {
        return this.childNodes.reduce((prev, current) => (prev.ucb() > current.ucb()) ? prev : current);
    }

    update(somebodyWon, iWon) {
        if (somebodyWon) {
            if (iWon) {
                this.wins++;
            }
            else {
                this.lost++;
            }
        }
        this.visits += 1;
    }
}

function roundNum(number, precision) {
    var power = Math.pow(10, precision);

    return Math.round(number * power) / power;
}

exports.Mcts = Mcts;