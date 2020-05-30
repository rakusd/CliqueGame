const INVALID = -1, EMPTY = 0, PLAYER1 = 1, PLAYER2 = 2;
class Board {

    constructor(verticesCount) {
        this.verticesCount = verticesCount;
        this.fields = new Array(verticesCount);
        for (let i = 0; i < this.fields.length; i++) {
            this.fields[i] = new Array(verticesCount);
            this.fields[i].fill(EMPTY);
            this.fields[i][i] = INVALID;
        }
        this.moveCount = 0;
    }

    getPossibleMoves() {
        let movesList = [];

        for (let i = 0; i < this.verticesCount; i++) {
            for (let j = i + 1; j < this.verticesCount; j++) {
                if (this.fields[i][j] === EMPTY) {
                    movesList.push([i, j]);
                }
            }
        }

        return movesList;
    }

    markMove(vertices, player) {
        if (this.fields[vertices[0]][vertices[1]] !== EMPTY ||
            this.fields[vertices[1]][vertices[0]] !== EMPTY) {
            throw 'Place is already taken';
        }

        this.fields[vertices[0]][vertices[1]] = player;
        this.fields[vertices[1]][vertices[0]] = player;
        this.moveCount++;
    }

    isAlreadyTaken(vertices) {
        return this.fields[vertices[0]][vertices[1]] !== EMPTY ||
            this.fields[vertices[1]][vertices[0]] !== EMPTY;
    }

    copyBoard() {
        let newBoard = new Board(this.verticesCount);

        for (let i = 0; i < this.verticesCount; i++) {
            newBoard.fields[i] = this.fields[i].slice();
        }
        newBoard.moveCount = this.moveCount;

        return newBoard;
    }

    doesCliqueExist(size, player) {
        let possibleVertices = [];
        for (let i = 0; i < this.verticesCount; i++) {
            let degree = 0;

            for (let j = 0; j < this.verticesCount; j++) {
                if (this.fields[i][j] === player) {
                    degree++;
                }
            }

            if (degree >= size - 1) {
                possibleVertices.push(i);
            }
        }

        if (possibleVertices.length < size) {
            return false;
        }

        let verticesSet = new Set();
        return this._addToClique(size, player, verticesSet, 0, possibleVertices);
    }

    _addToClique(size, player, verticesSet, nextVertexIndex, possibleVertices) {
        if (verticesSet.size === size) {
            this.clique = new Set(verticesSet); 
            return true;
        }

        for (let i = nextVertexIndex; i < possibleVertices.length - (size - verticesSet.size - 1); i++) {
            if (this._canBeAddedToClique(player, verticesSet, possibleVertices[i])) {
                verticesSet.add(possibleVertices[i]);
                if (this._addToClique(size, player, verticesSet, i + 1, possibleVertices)) {
                    return true;
                }
                verticesSet.delete(possibleVertices[i]);
            }
        }

        return false;
    }

    _canBeAddedToClique(player, verticesSet, vertex) {
        for (let v of verticesSet) {
            if (this.fields[v][vertex] !== player) {
                return false;
            }
        }

        return true;
    }
}


exports.Board = Board;
exports.INVALID = INVALID;
exports.EMPTY = EMPTY;
exports.PLAYER1 = PLAYER1;
exports.PLAYER2 = PLAYER2;