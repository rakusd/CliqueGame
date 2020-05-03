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
node run.js {PATH_TO_CONFIGURATION_FILE}
```
#Bundle into executables
In order to create executables, you need to install pkg by running
```bash
npm install -g pkg
```
Then, in the main directory on the project, you need to run
```bash
pkg . --out-path exe
```
You can run created executable by typing the following command into the console:
```bash
./{NAME_OF_THE_EXECUTABLE} {PATH_TO_CONFIGURATION_FILE}
```



