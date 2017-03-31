//CONSTANTS
export const HEIGHT = 414; //Canvas Height
export const WIDTH = 736; //Canvas Width
export const XMIN = 0;
export const YMIN = 0;
export const XMAX = WIDTH;
export const YMAX = HEIGHT;
export const TARGET = 80; //Target Height/Width
export const FLASH_OFFSET = 20; //Flash location to cursor
export const FLASH_LENGTH = 10; //How long the flash stays on screen
export const COLLISION_PADDING = 20; //How percise the user has to be to hit the target
export const HYPERSPEED = 20; //How fast the target 'falls' or 'flys away'
export const ROUNDS_PER_LEVEL = 10; //Number of rounds per level
export const WINNING_THRESHOLD = Math.floor(ROUNDS_PER_LEVEL * .75); //How many rounds to win a level
export const SCORE_MAP = {
    2: 100,
    1: 50,
    0: 25,
}; //Points received based on how many shells are left
export const DUCKSTATE = {
    WAITING: 'waiting',
    DEAD: 'dead',
    FLYAWAY: 'flyaway',
    INFLIGHT: 'inFlight',
    RESET: 'reset',
};

export const DIRECTION = {
    UP: 'up',
    DOWN: 'down',
    RIGHT: 'right',
    LEFT: 'left'
}
