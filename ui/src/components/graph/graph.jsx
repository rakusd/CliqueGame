import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createEmptyGraph } from '../../services/graph-creator-service';
import CytoscapeComponent from 'react-cytoscapejs';
const { Game }  = require('../../../../game/Game.js');


const game = new Game();
const playerConfig = {
    cliqueSize: 3,
    verticesCount: 7,
    player1: {
        type: 'human'
    },
    player2: {
        type: 'random'
    }
};
game.initGame(playerConfig);
game.startHumanComputerGame();
const WIDTH = 600;
const HEIGHT = 600;
const R = 200;
let v1 = -1;
let player = 1;
export function Graph() {
    const [elements, setElements] = useState(createEmptyGraph(playerConfig.verticesCount, WIDTH / 2, HEIGHT /2, R));
    let cytoscapeRef = useRef(null);

    useEffect(() => {
        if (cytoscapeRef) {
            cytoscapeRef.on('tap', 'edge', event => v1 = -1);
            cytoscapeRef.on('tap', 'node', (event) => {
                if (!event.target.id) {
                    v1 = -1;
                    return;
                }
                const id = Number(event.target.id());
                if (v1 === -1) {
                    v1 = id;
                }
                else {
                    if (v1 === id) {
                        return; 
                    }
                    const edgeColor = player === 1 ? 'red' : 'blue';
                    setElements(elements => [...elements, {group: 'edges', data: {source: v1, target: id, edgeColor}}]);
                    cytoscapeRef.one('select', () => {
                        cytoscapeRef.$(':selected').unselect();
                    });
                    const newMove = game.makeHumanPlayerMove([v1, id]);
                    setElements(elements => [...elements, {group: 'edges', data: {source: newMove[0], target: newMove[1], edgeColor}}]);
                    player = -player;
                    v1 = -1;
                }
            });
        }
    }, [cytoscapeRef]);
    return (
        <CytoscapeComponent elements={elements} 
        cy={(cy) => { cytoscapeRef = cy }}
        panningEnabled={false}
        zoomingEnabled={false}
        autolock={true}
        style={ {width: `${WIDTH}px`, height: `${HEIGHT}px`} }
        stylesheet={[
            {
              selector: 'edge',
              style: {
                  lineColor: "data(edgeColor)"
              }
            }
          ]}>
        </CytoscapeComponent>
    )
}