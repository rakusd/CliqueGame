import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createEmptyGraph } from '../../services/graph-creator-service';
const { Game }  = require('../../../../game/Game.js');
import { Graph } from '../graph/graph';

const WIDTH = 600;
const HEIGHT = 600;
const R = 200;
const game = new Game();
let v1 = -1;
let player = 1;
export function GameBoard({gameConfig}) {
    const [elements, setElements] = useState([]);

    const onEdgeTap = () => v1 = -1;

    const onTap = (event) => {
        if (!event.target.id) {
            v1 = -1;
        }
    }

    const onNodeTap = (event) => {
        const id = Number(event.target.id());
        if (v1 === -1) {
            v1 = id;
            return false;
        }
        else {
            if (v1 === id) {
                return false; 
            }
            const edgeColor = player === 1 ? 'red' : 'blue';
            setElements(elements => [...elements, {group: 'edges', data: {source: v1, target: id, edgeColor}}]);
            player = -player;
            v1 = -1;
            return true;
        }
        return false;
    };

    useEffect(() => {
        if (!gameConfig) {
            return;
        }
        game.initGame(gameConfig);
        setElements(createEmptyGraph(gameConfig.verticesCount, WIDTH / 2, HEIGHT /2, R));
    }, [gameConfig]);
    
    return (
        <Graph elements={elements} onEdgeTap={onEdgeTap} onNodeTap={onNodeTap} onTap={onTap}></Graph>
    )
}