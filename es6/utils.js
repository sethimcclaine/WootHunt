/**
 * Util for Math.random
 * @param  {int} min min possible value
 * @param  {int} max max possible value
 * @return {int}     int between min and max
 */
export const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
