const { Game } = require('./Game.js');
const fs = require('fs');

// const configPath = process.argv.slice(2)[0];
// let config;
// try {
//     const text = fs.readFileSync(configPath, { encoding: 'utf8' });
//     config = JSON.parse(text)
// } catch (err) {
//     console.error(err);
//     return 1;
// }

config = {
    'verticesCount': 20,
    'cliqueSize': 9,
    'currentPlayer': 1,
    'player2': {
        'type': 'random'
    },
    'player1': {
        'type': 'alphaBeta',
        'depth': 4,
        'advancedStrategy': false
    }
};


const game = new Game();
game.initGame(config);
let winner = game.playAutomaticGameOfBots();

console.log("Winner: " + winner);
console.log("Game finished! The winner is player: " + game.winner);
console.log("He has won in " + game.moveCount + " moves!");

console.log("Done!");
if(winner === null) {
    console.log("sth broke");
}

game.initGame(config);
game.makeMove([1,4],1);
game.makeMove([4,5],2);
game.makeMove([0,3],1);
game.makeMove([3,5],2);
game.makeMove([1,3],1);
game.makeMove([0,1],2);
game.makeMove([1,2],1);
game.makeMove([2,4],2);
game.makeMove([0,5],1);
game.makeMove([2,3],2);
game.makeMove([0,4],1);
game.makeMove([3,4],2);
console.log(game.checkIfPlayerWon(2));