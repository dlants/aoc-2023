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

export async function day2b(dataPath?: string) {
  const data = await readData(dataPath);

  const powers = [];
  for (const line of data) {
    if (!line.length) {
      continue;
    }
    const game = parseGame(line);
    console.log('game: ', game);
    const minSet = _.reduce(game.samples, sumSubsets, {});
    console.log('minSet: ', minSet);
    console.log('power: ', power(minSet));
    powers.push(power(minSet));
  }

  return _.reduce(powers, (num, acc) => num + acc, 0);
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

function sumSubsets(sample1: Sample, sample2: Sample) {
  const sum: Sample = {
    ...sample1,
  };

  for (const color in sample2) {
    if (!sum[color]) {
      sum[color] = sample2[color];
    } else {
      sum[color] = Math.max(sum[color], sample2[color]);
    }
  }

  return sum;
}

function power(sample: Sample) {
  return _.reduce(_.values(sample), (a, b) => a * b, 1);
}

const answer = await day2b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
