import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

type Sample = {
  [cube: string]: number;
};

type Game = {
  id: string;
  samples: Sample[];
};

const MAX_CUBES: Sample = {
  red: 12,
  green: 13,
  blue: 14,
};

export async function day2a(dataPath?: string) {
  const data = await readData(dataPath);

  const possibleGameIds = [];
  for (const line of data) {
    if (!line.length) {
      continue;
    }
    const game = parseGame(line);
    console.log('game: ', game);
    let possible = true;
    for (const sample of game.samples) {
      if (!isSubset(sample, MAX_CUBES)) {
        console.log('sample is impossible: ', sample)
        possible = false;
        break;
      }
    }
    if (possible) {
      possibleGameIds.push(game.id);
    }
  }

  console.log('possibleGameIds: ', possibleGameIds);

  return _.reduce(
    possibleGameIds.map(parseFloat),
    (num, acc) => num + acc,
    0,
  );
}

function parseGame(line: string): Game {
  const [gameStr, samplesStr] = line.split(': ');
  const [_, gameId] = gameStr.split(' ');
  const samples: Sample[] = [];
  for (const sampleStr of samplesStr.split('; ')) {
    const sample: Sample = {};
    const cubeStrs = sampleStr.split(', ');
    for (const cubeStr of cubeStrs) {
      const [num, color] = cubeStr.split(' ');
      sample[color] = parseFloat(num);
    }

    samples.push(sample);
  }

  return {
    id: gameId,
    samples,
  };
}

// sample1 is subset of sample2
function isSubset(sample1: Sample, sample2: Sample) {
  for (const color in sample1) {
    if (sample1[color] > 0) {
      if (!sample2[color]) {
        return false;
      }

      if (sample1[color] > sample2[color]) {
        return false;
      }
    }
  }

  return true;
}

const answer = await day2a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
