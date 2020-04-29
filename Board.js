const INVALID = -1, EMPTY = 0, PLAYER1 = 1, PLAYER2 = 2;
class Board {

    constructor(verticeCount) {
        this.verticeCount = verticeCount;
        this.fields = new Array(verticeCount);
        for(let i=0; i < this.fields.length; i++) {
            this.fields[i] = new Array(verticeCount);
            this.fields[i].fill(EMPTY);
            this.fields[i][i] = INVALID;
        }
    }

    getPossibleMoves() {
        var movesList = [];
        
        for(let i=0; i < this.verticeCount; i++) {
            for(let j=i+1; j < this.verticeCount; j++) {
                if(this.fields[i][j] == EMPTY) {
                    movesList.push([i, j]);
                }
            }
        }

        return movesList;
    }

    markMove(vertices, player) {
        if(this.fields[vertices[0]][vertices[1]] != EMPTY ||
            this.fields[vertices[1]][vertices[0]] != EMPTY) {
                throw 'Place is already taken';    
            }

        this.fields[vertices[0]][vertices[1]] = player;
        this.fields[vertices[1]][vertices[0]] = player;
    }

    copyBoard() {
        var newBoard = new Board(this.verticeCount);
        
        for(let i=0; i < this.verticeCount; i++) {
            newBoard.fields[i] = this.fields[i].slice();
        }
        
        return newBoard;
    }

    doesCliqueExist(size, player) {
        var possibleVertices = [];
        for(let i=0; i < this.verticeCount; i++) {
            let degree = 0;
            
            for(let j=0; j < this.verticeCount; j++) {
                if(this.fields[i][j] == player) {
                    degree++;
                }
            }

            if(degree >= size - 1) {
                possibleVertices.push(i);
            }
        }

        if(possibleVertices.length < size) {
            return false;
        }
        
        var verticeSet = new Set();
        return this._addToClique(size, player, verticeSet, 0, possibleVertices);
    }

    _addToClique(size, player, verticeSet, nextVerticeIndex, possibleVertices) {
        if(verticeSet.size == size) {
            return true;
        }

        for(let i = nextVerticeIndex; i < possibleVertices.length - (size - verticeSet.size - 1) ; i++) {
            if(this._canBeAddedToClique(player, verticeSet, possibleVertices[i])) {
                verticeSet.add(i);
                if(this._addToClique(size, player, verticeSet, i+1, possibleVertices)) {
                    return true;
                }
                verticeSet.delete(i);
            }
        }

        return false;
    }

    _canBeAddedToClique(player, verticeSet, vertice) {
        for(let v of verticeSet) {
            if(this.fields[v][vertice] != player) {
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