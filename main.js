const { Game } = require('./Game.js');
const fs = require('fs');

module.exports = configPath => {
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

    if(winner !== null) {
        console.log("Game finished! The winner is Player " + winner);
        console.log("He has won in " + game.moveCount + " moves!");
    } else {
        console.log("After "+game.moveCount + " moves game has ended as a draw!");
    }
    
}