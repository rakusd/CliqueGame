const {Game} = require('./Game.js');

config = {
    'verticeCount': 6,
    'cliqueSize': 3,
    'currentPlayer': 1,
    'player1': {
        'type': 'random'
    },
    'player2': {
        'type': 'random'
    }
};

var game = new Game();
game.initGame(config);
game.playAutomaticGameOfBots();

console.log("Game finished! The winner is player: " + game.winner);
console.log("He has won in " + game.moveCount + " moves!");

var a = 2;