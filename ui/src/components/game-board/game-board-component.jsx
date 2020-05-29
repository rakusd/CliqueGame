import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createEmptyGraph } from '../../services/graph-creator-service';
const { Game } = require('../../../../game/Game.js');
import { Graph } from '../graph/graph';
import { Col, Button } from 'react-bootstrap';
const { PLAYER1, PLAYER2 } = require('../../../../game/Board.js');

const WIDTH = 600;
const HEIGHT = 600;
const R = 200;
const game = new Game();
let v1 = -1;
let player = PLAYER1;
let cancel = false;


const promiseMove = (game) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(game.makeMoveInBotVsBot());
        }, 1000);
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
        while (!cancel) {
            const move = await promiseMove(game);
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
    const colorForPlayer = (id) => id === PLAYER1 ? 'red' : 'blue';

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
            if (!game.canMove()) {
                alert(`draw`);
            }
            const edgeColor = colorForPlayer(player);
            setElements(elements => [...elements, { group: 'edges', data: { source: v1, target: id, edgeColor } }]);

            game.makeOnlyHumanMove([v1, id]);
            if (game.checkIfPlayerWon(player)) {
                setTimeout(() => alert(`player: ${player} won`), 1000);
                return true;
            }
            player = player === PLAYER1 ? PLAYER2 : PLAYER1;
            v1 = -1;

            //bot response
            if (gameConfig.player1.type !== 'human' || gameConfig.player2.type !== 'human') {
                if (!game.canMove()) {
                    alert(`draw`);
                    return false;
                }
                const botMove = game.makeOnlyBotMove();
                const edgeColor = colorForPlayer(player);
                setElements(elements => [...elements, { group: 'edges', data: { source: botMove[0], target: botMove[1], edgeColor } }]);
                if (game.checkIfPlayerWon(player)) {
                    setTimeout(() => alert(`player: ${player} won`), 1000);
                    return true;
                }
                player = player === PLAYER1 ? PLAYER2 : PLAYER1;
            }
            return true;
        }
    };

    const close = () => {
        cancel = true;
        cancelGame();
    }

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
        cancel = false;
        game.initGame(gameConfig);
        setElements(createEmptyGraph(gameConfig.verticesCount, WIDTH / 2, HEIGHT / 2, R));

        if (gameConfig.player1.type !== 'human' && gameConfig.player2.type !== 'human') {
            console.log("game bot vs bot");
            setTimeout(async () => await botVsBotGame(game), 10);

        } else if (gameConfig.player1.type === 'human' && gameConfig.player2.type === 'human') {
            console.log("game human vs human");

        }
        else if (gameConfig.player1.type === 'human') {
            console.log("game human starts");
            const move = game.startHumanComputerGame();
        }
        else {
            console.log("bot starts");
            const move = game.startHumanComputerGame();
            const edgeColor = colorForPlayer(PLAYER1);
            setElements(elements => [...elements, { group: 'edges', data: { source: move[0], target: move[1], edgeColor } }]);
            player = PLAYER2;
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