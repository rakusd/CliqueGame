import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createEmptyGraph } from '../../services/graph-creator-service';
const { Game } = require('../../../../game/Game.js');
import { Graph } from '../graph/graph';
import { Col, Button } from 'react-bootstrap';
const { INVALID, EMPTY, PLAYER1, PLAYER2 } = require('../../../../game/Board.js');

const WIDTH = 600;
const HEIGHT = 600;
const R = 200;
const game = new Game();
let v1 = -1;
let player = PLAYER1;


const promiseMove = (makeMove) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(makeMove());
        }, 1);
    });
}

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

    const botVsBotGame = async (game) => {
        while (true) {
            const move = await promiseMove(game.makeMoveInBotVsBot);
            if (typeof (move) === 'number') {
                if (move === 0) {
                    alert("draw");
                    return "draw";
                } else {
                    alert(`bot: ${move}`)
                    return;
                }
            }
            else {
                const edgeColor = player === PLAYER1 ? 'red' : 'blue';
                setElements(elements => [...elements, { group: 'edges', data: { source: move[0], target: move[1], edgeColor } }]);
                player = player === PLAYER1 ? PLAYER2 : PLAYER1;
            }
        }
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
            const edgeColor = player === PLAYER1 ? 'red' : 'blue';
            setElements(elements => [...elements, { group: 'edges', data: { source: v1, target: id, edgeColor } }]);

            // game.markMove([v1, id], player1);
            // if (game.checkIfPlayerWon(player)) {
            //     alert(`player: {player} won`);
            //     return;
            // }

            player = player === PLAYER1 ? PLAYER2 : PLAYER1;
            v1 = -1;
            //bot response
            // if (gameConfig.player1.type !== 'Human' || gameConfig.player2.type !== 'Human') {
            //     game.makeMoveInBotVsBot()
            // }
            // if (game.checkIfPlayerWon(player)) {
            //     alert(`player: {player} won`);
            //     return;
            // }
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

        if (gameConfig.player1.type !== 'Human' && gameConfig.player2.type !== 'Human') {
            console.log("game bot vs bot");
            setTimeout(async () => await botVsBotGame(game), 10);
        } else if (gameConfig.player1.type === 'Human' && gameConfig.player2.type === 'Human') {
            console.log("game human vs human");
        }
        else if (gameConfig.player1.type === 'Human') {
            console.log("game human starts");
        }
        else {
            console.log("bot starts");
        }
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