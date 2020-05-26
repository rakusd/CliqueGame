const { PLAYER1, PLAYER2 } = require('./Board.js');
const { AlphaBeta } = require('./AlphaBeta.js')

Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}

Set.prototype.symetricDifference = function(setB) {
    return this.union(setB).difference(this.intersection(setB));
}

class AlphaBetaPlayer {
    constructor(cliqueSize, depth, botNumber, advancedStrategy) {
        this.me = botNumber;
        if(this.me == PLAYER1) {
            this.enemy = PLAYER2;
        } else {
            this.enemy = PLAYER1;
        }
        if(!advancedStrategy) {
            this.evaluation = function(board) {
                return getPoints(board, this.me, this.enemy, getMaxCliques(board, this.me));
            }
        } else {
            this.evaluation = function(board) {
                let myPoints = getPoints(board, this.me, this.enemy, getMaxCliques(board, this.me));
                let enemyPoints = getPoints(board, this.enemy, this.me, getMaxCliques(board, this.enemy));
                return myPoints - enemyPoints;
            }
        }
        this.alphaBeta = new AlphaBeta(depth, this.evaluation, this.me, this.enemy, cliqueSize);
    }

    decideMove(lastMove, boardCopy) {
        return this.alphaBeta.getMovesEval(boardCopy);
    }
}

function getMaxCliques(board, player) {
    let cliques = [];
    let newCliques = [];

    // cliques of size 2
    for (let i = 0; i < board.verticesCount; i++) {
        for (let j = i + 1; j < board.verticesCount; j++) {
            if (board.fields[i][j] === player) {
                let set = new Set();
                set.add(i);
                set.add(j);
                cliques.push(set);
            }
        }
    }

    while(true) {
        newCliques = [];
        for(i = 0; i < cliques.length; i++) {
            for(j = i+1; j < cliques.length; j++) {
                let symDiff = cliques[i].symetricDifference(cliques[j]);
                if(symDiff.size == 2) {
                    let it = symDiff.values();
                    vertice1 = it.next().value;
                    vertice2 = it.next().value;

                    if(board.fields[vertice1][vertice2] === player) {
                        newCliques.push(cliques[i].union(cliques[j]));
                    }
                }
            }
        }

        if (newCliques.length === 0) {
            break;
        }
        // keep only unique newCliques
        let uniqueCliques = [];
        for(let clique of newCliques) {
            let isUnique = true;
            for(let uniqueClique of uniqueCliques) {
                if(clique.union(uniqueClique).size === clique.size) {
                    isUnique = false;
                    break;
                }
            }
            if(isUnique) {
                uniqueCliques.push(clique);
            }
        }

        cliques = uniqueCliques;
    }

    return cliques;
}

function getPoints(board, me, enemy, cliques) {
    let bestValue = 0;
    for(clique of cliques) {
        // value is equal to 2* number of edges in clique
        let value = clique.size * (clique.size - 1);
        for(let possibleVertice = 0; possibleVertice < board.verticesCount; possibleVertice++) {
            let verticeValue = 0;
            
            if(clique.has(possibleVertice)) {
                continue;
            }

            for(let cliqueVertice of clique) {
                if(board.fields[possibleVertice][cliqueVertice] == enemy) {
                    // vertice cannot be added to current clique as enemy has edge between clique and vertice
                    verticeValue = 0;
                    break;
                }
                if(board.fields[possibleVertice][cliqueVertice] == me) {
                    verticeValue++;
                }
            }

            value += verticeValue;
        }

        bestValue = Math.max(bestValue, value);
    }
    return bestValue;
}

exports.AlphaBetaPlayer = AlphaBetaPlayer;