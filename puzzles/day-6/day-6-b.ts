import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

export async function day6a(dataPath?: string) {
  const data = await readData(dataPath);
  const times = [parseFloat(
    data[0]
      .split(':')[1]
      .split(' ')
      .filter((c) => c.length)
      .join(''),
  )];

  const distances = [parseFloat(
    data[1]
      .split(':')[1]
      .split(' ')
      .filter((c) => c.length)
      .join(''),
  )];

  let prod = 1;
  for (const raceIdx of _.range(times.length)) {
    const time = times[raceIdx];
    const distance = distances[raceIdx];

    const minTime = Math.ceil(minWinningTime(time, distance));
    const maxTime = Math.floor(maxWinningTime(time, distance));
    const numWaysToWin = maxTime - minTime + 1;
    console.log(
      `${numWaysToWin} ways to win game ${raceIdx} (t: ${time}, d: ${distance}, minTime: ${minTime}, maxTime: ${maxTime})`,
    );
    prod *= numWaysToWin;
  }

  return prod;
}

function minWinningTime(maxTime: number, recordDistance: number) {
  return (
    (maxTime - Math.sqrt(Math.pow(maxTime, 2) - 4 * recordDistance)) / 2 +
    0.000001
  ); // we need to be a bit above this;
}

function maxWinningTime(maxTime: number, recordDistance: number) {
  return (
    (maxTime + Math.sqrt(Math.pow(maxTime, 2) - 4 * recordDistance)) / 2 -
    0.000001
  ); // we need to be a bit below this;
}

const answer = await day6a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
