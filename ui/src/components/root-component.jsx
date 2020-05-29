import React, { useState } from 'react';
import { Graph } from './graph/graph';
import { Config } from './config/config-component';
import { GameBoard } from './game-board/game-board-component';

export function Root() {
  const [initialConfig, setInitialConfig] = useState({
    verticesCount: 10,
    cliqueSize: 4,
    player1: {
      type: 'Human',
      depth: 0,
      timeout: 0,
      advancedStrategy: false
    },
    player2: {
      type: 'random',
      depth: 0,
      timeout: 0,
      advancedStrategy: false
    }
  });
  const [gameConfig, setGameConfig] = useState({});
  const [gamePlaying, setGamePlaying] = useState(false);

  const cancelGame = () => {
    setGameConfig({});
    setGamePlaying(false);
  }

  const onStartGame = (newConfig) => {
    setGameConfig({ ...newConfig });
    setGamePlaying(true);
  };

  return !gamePlaying ? <Config initialConfig={initialConfig} onStartGame={onStartGame}></Config> : <GameBoard gameConfig={gameConfig} cancelGame={cancelGame}></GameBoard>;
}