import React, { useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';

const playerTypes = [
    {
        name: 'Human',
        value: 'human'
    },
    {
        name: 'Random',
        value: 'random'
    },
    {
        name: 'Alpha beta',
        value: 'alphaBeta'
    },
    {
        name: 'Monte Carlo',
        value: 'monteCarlo'
    }
];



export function Config({ initialConfig, onStartGame }) {
    const [playerTypesState, setPlayerTypesState] = useState([...playerTypes]);
    const [gameConfig, setGameConfig] = useState({ ...initialConfig });

    const changeConfig = (e, prop) => {
        const value = Number(event.target.value);
        setGameConfig(oldConfig => ({ ...oldConfig, [prop]: value }));
    };

    const changePlayerConfig = (player, value, prop) => {
        setGameConfig(oldConfig => ({
            ...oldConfig, [player]: {
                ...oldConfig[player], [prop]: value
            }
        }));
    };

    const startGame = () => {
        onStartGame(gameConfig);
    };


    return (
        <Form>
            <Form.Group controlId="noVertices">
                <Form.Label>Number of vertices</Form.Label>
                <Form.Control type="number" min={1} value={gameConfig.verticesCount} 
                onChange={e => changeConfig(e, 'verticesCount')} />
            </Form.Group>

            <Form.Group controlId="maxClique">
                <Form.Label>Max clique</Form.Label>
                <Form.Control type="number" min={1} value={gameConfig.cliqueSize} 
                onChange={e => changeConfig(e, 'cliqueSize')} />
            </Form.Group>

            <h3>Player1</h3>
            <Form.Row>
                <Col>
                    <Form.Group controlId="player1Type">
                        <Form.Label>Strategy type</Form.Label>
                        <Form.Control as="select" value={gameConfig.player1.type}
                        onChange={event => changePlayerConfig('player1', event.target.value, 'type')}>
                            {
                                playerTypesState.map(playerType => <option value={playerType.value} 
                                    key={playerType.value}>{playerType.name}</option>)
                            }
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="player1Depth">
                        <Form.Label>Tree depth</Form.Label>
                        <Form.Control type="number" min={0} value={gameConfig.player1.depth} 
                        onChange={event => changePlayerConfig('player1', Number(event.target.value), 'depth')}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="player1Timeout">
                        <Form.Label>Stopping Timeout</Form.Label>
                        <Form.Control type="number" min={0} value={gameConfig.player1.timeout} 
                        onChange={event => changePlayerConfig('player1', Number(event.target.value), 'timeout')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="player1AdvancedStrategy">
                        <Form.Label>Advanced strategy</Form.Label>
                        <Form.Check type="checkbox" value={gameConfig.player1.advancedStrategy} 
                        onChange={event => changePlayerConfig('player1', Boolean(event.target.value), 'advancedStrategy')} />
                    </Form.Group>
                </Col>
            </Form.Row>

            <h3>Player2</h3>
            <Form.Row>
                <Col>
                    <Form.Group controlId="player2Type">
                        <Form.Label>Strategy type</Form.Label>
                        <Form.Control as="select" value={gameConfig.player2.type}
                        onChange={event => changePlayerConfig('player2', event.target.value, 'type')}>
                            {
                                playerTypesState.map(playerType => <option value={playerType.value} 
                                    key={playerType.value}>{playerType.name}</option>)
                            }
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="player2Depth">
                        <Form.Label>Tree depth</Form.Label>
                        <Form.Control type="number" min={0} value={gameConfig.player2.depth} 
                        onChange={event => changePlayerConfig('player2', Number(event.target.value), 'depth')}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="player2Timeout">
                        <Form.Label>Stopping Timeout</Form.Label>
                        <Form.Control type="number" min={0} value={gameConfig.player2.timeout} 
                        onChange={event => changePlayerConfig('player2', Number(event.target.value), 'timeout')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="player2AdvancedStrategy">
                        <Form.Label>Advanced strategy</Form.Label>
                        <Form.Check type="checkbox" value={gameConfig.player2.advancedStrategy} 
                        onChange={event => changePlayerConfig('player2', event.target.checked, 'advancedStrategy')}/>
                    </Form.Group>
                </Col>
            </Form.Row>
            <Button variant="primary" block onClick={() => startGame()}>
                Start game
            </Button>
        </Form>
    )
}