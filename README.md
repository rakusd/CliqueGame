# CliqueGame

## Simple configurations
```json
{
    "verticesCount": int,
    "cliqueSize": int,
    "player1": PLAYER_OBJECT,
    "player2": PLAYER_OBJECT
}
```
### Possible Players (PLAYER_OBJECTS)

RANDOM:
```json
{
    "type": "random",
}
```
MONTE CARLO TREE SEARCH:
```json
{
    "type": "monteCarlo",
    "timeout": int (ms),
}
```

ALPHA BETA:
```json
{
    "type": "alphaBeta",
    "depth": int,
    "advancedStrategy":true/false (takes into account how close to winning is opponent)
}
```

### Example configuration
```json
{
    "verticesCount": 10,
    "cliqueSize": 4,
    "player1": {
        "type": "alphaBeta",
        "depth": 2,
        "advancedStrategy": true
    },
    "player2": {
        "type": "monteCarlo",
        "timeout": 1000
    }
}
```
# Run Program
Install dependencies:
```bash
npm install
```
Run program
```bash
node main.js {PATH_TO_CONFIGURATION_FILE}
```




