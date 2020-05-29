import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createEmptyGraph } from '../../services/graph-creator-service';
const { Game } = require('../../../../game/Game.js');
import { Graph } from '../graph/graph';
import { Col, Button } from 'react-bootstrap';

const WIDTH = 600;
const HEIGHT = 600;
const R = 200;
const game = new Game();
let v1 = -1;
let player = 1;
export function GameBoard({ gameConfig, cancelGame }) {
    const [elements, setElements] = useState([]);

    const onEdgeTap = () => v1 = -1;

    const onTap = (event) => {
        if (!event.target.id) {
            v1 = -1;
        }
    }
    const edgeExist = (elems, v1, v2) => {
        const inx = elems.findIndex(e =>
            e.group === 'edges' &&
            ((e.data.source == v1 && e.data.target == v2) ||
                (e.data.source == v2 && e.data.target == v1)));
        return inx !== -1;
    }

    const onNodeTap = (event) => {
        const id = Number(event.target.id());
        if (v1 === -1) {
            v1 = id;
            return false;
        }
        else {
            //TODO elements are empty
            if (v1 === id || edgeExist(elements, v1, id)) {
                return false;
            }
            const edgeColor = player === 1 ? 'red' : 'blue';
            setElements(elements => [...elements, { group: 'edges', data: { source: v1, target: id, edgeColor } }]);
            player = -player;
            v1 = -1;
            return true;
        }
        return false;
    };

    const close = () => cancelGame();

    const listOfMoves = (elems) => {

        if (elems) {
            const moves = elems.filter(el => el.group === 'edges')
            return (moves.map((m, i) => <div key={i}> from {m.data.source} to: {m.data.target} player: {m.data.edgeColor} </div>))
        }
    }

    useEffect(() => {
        if (!gameConfig) {
            return;
        }
        game.initGame(gameConfig);
        setElements(createEmptyGraph(gameConfig.verticesCount, WIDTH / 2, HEIGHT / 2, R));
    }, [gameConfig]);

    return (
        <div>
            <Button variant="danger" block onClick={() => close()}>Cancel game</Button>
            <Col>
                <Graph elements={elements} onEdgeTap={onEdgeTap} onNodeTap={onNodeTap} onTap={onTap}></Graph>
            </Col>
            <Col>
                {listOfMoves(elements)}
            </Col>
        </div>
    )
}