const { Game } = require('./Game.js');
const fs = require('fs');

const configPath = process.argv.slice(2)[0];
let config;
try {
    const text = fs.readFileSync(configPath, { encoding: 'utf8' });
    config = JSON.parse(text)
} catch (err) {
    console.error(err);
    return 1;
}


const game = new Game();
game.initGame(config);
let winner = game.playAutomaticGameOfBots();

console.log("Winner: " + winner);
console.log("Game finished! The winner is player: " + game.winner);
console.log("He has won in " + game.moveCount + " moves!");