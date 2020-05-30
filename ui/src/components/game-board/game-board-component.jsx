import React, { useState, useRef, useEffect } from 'react';
import { createEmptyGraph } from '../../services/graph-creator-service';
const { Game } = require('../../../../game/Game.js');
import { Graph } from '../graph/graph';
import { Col, Button, Row, Container } from 'react-bootstrap';
const { PLAYER1, PLAYER2 } = require('../../../../game/Board.js');

const WIDTH = 600;
const HEIGHT = 600;
const R = 200;
let game = new Game();
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
    const [gameFinished, setGameFinished] = useState(false);
    const [gameFinishedText, setGameFinishedText] = useState("red is playing");
    const [unselectify, setUnselectify] = useState(false);
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
    const colorForPlayer = (id) => id === PLAYER1 ? 'red' : 'blue';


    const checkClique = (clique) => {
        if (!clique) {
            return;
        }
        const width = 8;
        const edgeColor = colorForPlayer(player);
        const cliqueVertices = [...clique];
        const newElements = [];
        for (var i = 0; i < cliqueVertices.length; i++) {
            for (var j = i + 1; j < cliqueVertices.length; j++) {
                newElements.push({ group: 'edges', data: { source: cliqueVertices[i], target: cliqueVertices[j], width, edgeColor } });
            }
        }
        setElements(oldElements => [...oldElements, ...newElements]);
    }

    const finishGame = (move) => {
        const text = move === 0 ? 'Draw' : (move === 1 ? 'Red player won!' : 'Blue player won!');
        setGameFinishedText(text);
        setGameFinished(true);
        checkClique(game.clique);
    }

    const onNewGame = () => {
        game = new Game();
        v1 = -1;
        player = PLAYER1;
        cancelGame();
    }

    const botVsBotGame = async (game) => {
        while (!cancel) {
            const move = await promiseMove(game);
            if (typeof (move) === 'number') {
                if (move === 0) {
                    finishGame(move);
                    return "draw";
                } else {
                    finishGame(move);
                    return;
                }
            }
            else {
                const edgeColor = player === PLAYER1 ? 'red' : 'blue';
                const width = 2;
                setElements(elements => [...elements, { group: 'edges', data: { source: move[0], target: move[1], edgeColor, width } }]);
                player = player === PLAYER1 ? PLAYER2 : PLAYER1;
                setGameFinishedText(`${colorForPlayer(player)} is playing`);
            }
        }
    }


    const onNodeTap = (event) => {
        if (unselectify) {
            return false;
        }
        const id = Number(event.target.id());
        const width = 2;
        if (v1 === -1) {
            v1 = id;
            return false;
        }
        else {
            //TODO elements are empty
            if (v1 === id || game.board.isAlreadyTaken([v1, id])) {
                v1 = -1;
                return true;
            }
            if (!game.canMove()) {
                finishGame(0);
            }
            const edgeColor = colorForPlayer(player);
            setElements(elements => [...elements, { group: 'edges', data: { source: v1, target: id, edgeColor, width } }]);

            const result = game.makeOnlyHumanMove([v1, id]);
            if (result === player) {
                finishGame(result);
                return true;
            }
            else if (result === 0) {
                finishGame(result);
                return true;
            }
            player = player === PLAYER1 ? PLAYER2 : PLAYER1;
            setGameFinishedText(`${colorForPlayer(player)} is playing`);
            v1 = -1;
            setUnselectify(true);
            //bot response
            if (!game.canMove()) {
                finishGame(0);
                return false;
            }

            setTimeout(() => {
                const botMove = game.makeOnlyBotMove();
                const edgeColor = colorForPlayer(player);
                setElements(elements => [...elements, { group: 'edges', data: { source: botMove[0], target: botMove[1], edgeColor, width } }]);
                if (game.checkIfPlayerWon(player)) {
                    finishGame(player);
                    return true;
                }
                player = player === PLAYER1 ? PLAYER2 : PLAYER1;
                setGameFinishedText(`${colorForPlayer(player)} is playing`);
                setUnselectify(false);
            });
            return true;
        }
    };

    const close = () => {
        cancel = true;
        cancelGame();
    }

    useEffect(() => {
        if (!gameConfig) {
            return;
        }
        cancel = false;
        game.initGame(gameConfig);
        setElements(createEmptyGraph(gameConfig.verticesCount, WIDTH / 2, HEIGHT / 2, R));

        if (gameConfig.player1.type !== 'human' && gameConfig.player2.type !== 'human') {
            setUnselectify(true);
            setTimeout(async () => {
                await botVsBotGame(game);
            }, 10);

        } else if (gameConfig.player1.type === 'human' && gameConfig.player2.type === 'human') {

        }
        else if (gameConfig.player1.type === 'human') {
            const move = game.startHumanComputerGame();
        }
        else {
            const move = game.startHumanComputerGame();
            const edgeColor = colorForPlayer(PLAYER1);
            const width = 2;
            setElements(elements => [...elements, { group: 'edges', data: { source: move[0], target: move[1], edgeColor, width } }]);
            setGameFinishedText("blue is playing");
            player = PLAYER2;
        }
    }, [gameConfig]);

    return (
        <Container>
            <Row>
                <Col>
                    <Graph elements={elements} onEdgeTap={onEdgeTap} onNodeTap={onNodeTap} onTap={onTap}
                        unselectify={unselectify}></Graph>
                </Col>
                <Col>
                    <div style={{"textAlign": "center", "marginTop": "100px", "fontSize": "2em"}}>
                        <p>{gameFinishedText}</p>
                        {gameFinished ? <Button onClick={onNewGame}>Start new game</Button> : null}
                    </div>
                </Col>
            </Row>
        </Container>
    )
}