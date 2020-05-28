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

console.log(config);
const game = new Game();
let p1wins=0,p1draws=0,p1losses=0;
for(let i = 0; i < 100000; i++) {
    game.initGame(config);
    let winner = game.playAutomaticGameOfBots();
    if(winner === 1) {
        p1wins++;
    } else if(winner === 2) {
        p1losses++;
    } else {
        p1draws++;
        console.log("Game drawn after "+game.moveCount+" moves!");
        break;
    }
    console.log("Winner: " + winner + " in " + game.moveCount + "moves!");
    console.log("Score: " +p1wins + "-" + p1draws + "-" + p1losses);
}

