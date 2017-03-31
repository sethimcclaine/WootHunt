import { random } from './utils';
import { HEIGHT, WIDTH, XMIN, YMIN, TARGET, XMAX, YMAX, FLASH_OFFSET, FLASH_LENGTH,
    COLLISION_PADDING, DUCKSTATE, HYPERSPEED, ROUNDS_PER_LEVEL, WINNING_THRESHOLD,
    SCORE_MAP, DIRECTION } from './constants';
import { setCanvasData, drawImageBackground, drawImageForeground, drawShotgunShells, drawTarget, drawFlash, drawScoreBoard,
    drawClickToStart } from './canvasActions';
import { getImages } from './images';
import { sum } from 'ramda';
//GLOBALS
let state = {
    level: 1,
    score: 0,
    highScore: 0,
    intervals: null,
    rounds: [],
    aim: {
        countDown: 0,
        position: {
            x:0,
            y:0,
        }
    },
    shells: {
        count: 0,
    },
    target: {
        showing: DUCKSTATE.WAITING,
        direction: {
            x: DIRECTION.RIGHT,
            y: null,
        },
        current: {
            x:0,
            y:0,
        },
        destination: {
            x: 0,
            y: 0,
        }
    }
};
const getStart = () => { return {
        x: state.target.current.x,
        y: (YMAX - TARGET)
    };
};
const getDead = () => { return {
        x: state.target.current.x,
        y: YMIN
    }
};
const getFlyaway = () => { return {
        x: state.target.current.x,
        y: YMAX
    }
};
/**
 * check if clicked area is within COLLISION_PADDING distance of target
 * @param  {object} aim   [description]
 * @param  {object} target  [description]
 * @return {bool}           if target is hit
 */
const checkCollision = (aim, target) =>
    (Math.abs(aim.x - target.x) <= COLLISION_PADDING && Math.abs(aim.y - target.y) <= COLLISION_PADDING);

/**
 * response to clicking the screen
 * @param  {object} e event
 * @return {bool} action was taken
 */
const bang = (e) => {
    if(state.target.showing !== DUCKSTATE.WAITING) {
        if(state.shells.count <= 0) {
            return false;
        }

        state.shells.count--;
        state.aim.countDown = FLASH_LENGTH;
        state.aim.position.x = e.layerX - FLASH_OFFSET;
        state.aim.position.y = e.layerY - FLASH_OFFSET;
        if (checkCollision(state.aim.position, state.target.current)) {
            state.target.destination = getDead();
            state.target.showing = DUCKSTATE.DEAD;
        } else if (state.shells.count === 0) {
            state.target.destination = getFlyaway();
            state.target.showing = DUCKSTATE.FLYAWAY;
        }
    } else {
        roundBegin();
    }
    render();
    return true
};
/**
 * if destination is maxed out create a new destination
 * @param  {Number} min             low value
 * @param  {Number} max             high value
 * @param  {Number} current         current value
 * @param  {Number} destination     destination value
 * @return {Number}                 current or new value for destination
 */
const checkDestination = (min, max, current, destination) => {
    //Recalculate destination if we reach a wall or destination with in the padding of the level
    if(Math.abs(current - destination) <= state.level || current <= min ||  current >= max) {
        return random(min, max);
    } else {
        return destination;
    }
};
/**
 * Update current position based on the destination posistion
 * @param  {Number}  current     [description]
 * @param  {Number}  destination [description]
 * @return {Number}             [description]
 */
const updateAxis = (current, destination, axis) => {
    //Using state.level as the speed of the target
    if(current > destination) {
        state.target.direction[axis] = DIRECTION.LEFT;
        return current -= state.level;
    } else {
        state.target.direction[axis] = DIRECTION.RIGHT;
        return current += state.level;
    }
};
/**
 * Update current position based on the destination posistion
 * @param  {Number} current     current position
 * @param  {Number} destination destination position
 * @return {Number}             current +/- state.level in the dirrection of destination
 */
const getNextPosition = (current, destination) => {
    switch (state.target.showing) {
        case DUCKSTATE.DEAD:
            if(current.y >= HEIGHT) {
                roundOver();
                return getStart();
            } else {
                state.target.direction = {x: null, y:DIRECTION.DOWN};
                return {
                    x: current.x,
                    y: current.y + HYPERSPEED,
                };

            }
        case DUCKSTATE.FLYAWAY:
            if(current.y <= 0) {
                roundOver();
                return getStart();
            } else {
                state.target.direction = {x: 0, y:DIRECTION.UP};
                return {
                    x: current.x,
                    y: current.y - HYPERSPEED,
                };
            }
        case DUCKSTATE.INFLIGHT:
            return {
                x: updateAxis(current.x, destination.x, 'x'),
                y: updateAxis(current.y, destination.y, 'y')
            };

        case DUCKSTATE.WAITING:
        default:
            console.log('error unhandled: '+state.target.showing);
            return {
                x: random(XMIN + TARGET, XMAX - TARGET),
                y: YMAX - TARGET,
            };
    }
};
/**
 * update the current state and then render
 */
const update = () => {
    if(state.aim.countDown > 0) {
        state.aim.countDown --;
    }
    state.target.destination.x = checkDestination(XMIN + TARGET, XMAX - TARGET, state.target.current.x, state.target.destination.x);
    state.target.destination.y = checkDestination(YMIN + TARGET, YMAX - TARGET, state.target.current.y, state.target.destination.y);
    state.target.current = getNextPosition(state.target.current, state.target.destination);
    render();
};
const nextLevel = () => {
    state.level += 1;
    state.rounds = [];
};
/**
 * setup for next level and begin interval calls of render
 */
const roundBegin = () => {
    state.shells.count = 3;
    state.target.current = {
        x: random(XMIN + TARGET, XMAX - TARGET),
        y: YMAX - TARGET,
    };
    state.target.destination = {
        x: random(XMIN + TARGET, XMAX - TARGET),
        y: random(YMIN + TARGET, YMAX - TARGET),
    };
    state.target.showing = DUCKSTATE.INFLIGHT;
    state.intervals = setInterval(update, 50); //1000 = second
}
const reset = () => {
    state.level = 1;
    state.rounds = [];
    if (state.score > state.highScore) {
        state.highScore = state.score;
    }
    state.score = 0;
};
/**
 * remove interval call of render
 */
const roundOver = () => {
    clearInterval(state.intervals);
    if (state.target.showing === DUCKSTATE.FLYAWAY) {
        state.rounds.push(0);
    } else if (state.target.showing === DUCKSTATE.DEAD) {
        state.rounds.push(1);
        state.score += SCORE_MAP[state.shells.count] * state.level;

    }
    if (state.rounds.length >= ROUNDS_PER_LEVEL) {
        state.target.showing = DUCKSTATE.WAITING;
        if(sum(state.rounds) >= WINNING_THRESHOLD) {
            nextLevel();
        } else {
            reset();
        }
    } else {
        roundBegin();
    }
}
/**
 * render the canvas based on state
 */
const render = () => {
    drawImageBackground();

    if(state.target.showing !== DUCKSTATE.WAITING) {
        drawTarget(state.target.current, state.target.direction);
    }
    drawImageForeground();
    if(state.aim.countDown > 0) {
        drawFlash(state.aim.position);
    }
    drawScoreBoard(state.rounds, state.score, state.highScore);
    drawShotgunShells(state.shells.count);
    if(state.target.showing === DUCKSTATE.WAITING) {
        drawClickToStart(state.level);
    }
};
/**
 * start the app
 */
const init = () => {
    // Create the canvas
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.body.appendChild(canvas);
    canvas.addEventListener('click', bang);
    const images = getImages(render);
    setCanvasData(ctx, images);
};
init();
