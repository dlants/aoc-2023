import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

type Differences = number[][];
export async function day9a(dataPath?: string) {
  const data = await readData(dataPath);
  const samples = [];
  for (const line of data) {
    if (line) {
      samples.push(line.split(' ').map(parseFloat));
    }
  }

  return _.reduce(samples.map(predictNext), (a, b) => a + b, 0);
}

function explodeDifferences(sample: number[]): Differences {
  const diffs: Differences = [sample];
  while (true) {
    const lastDiff = diffs[diffs.length - 1];
    if (_.every(lastDiff, (diff) => diff == 0)) {
      console.log('diffs: ', diffs)
      return diffs
    }

    const nextDiff = [];
    for (const idx of _.range(lastDiff.length - 1)) {
      nextDiff.push(lastDiff[idx + 1] - lastDiff[idx]);
    }

    diffs.push(nextDiff);
  }

}

function predictNext(sample: number[]) {
  const diffs = explodeDifferences(sample);
  let nextDiffInRow = 0;
  for (let diffDepth = diffs.length - 1; diffDepth >= 0; diffDepth -= 1) {
    const diffLayer = diffs[diffDepth];
    nextDiffInRow = diffLayer[diffLayer.length - 1] + nextDiffInRow;
  }

  return nextDiffInRow;
}

const answer = await day9a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
