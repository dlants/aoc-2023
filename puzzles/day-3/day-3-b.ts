import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

type GridCoord = {
  rowIdx: number;
  colIdx: number;
  length: number;
};

type GridNumber = {
  coord: GridCoord;
  n: number;
};

export async function day3b(dataPath?: string) {
  const data = await readData(dataPath);
  if (data[data.length - 1] == '') {
    data.pop();
  }

  const numbers: GridNumber[] = [];
  for (const line of data) {
    console.log(line);
  }

  for (const rowIdx of _.range(data.length)) {
    const line = data[rowIdx];
    const digitRegex = /(\d+)/g;
    while (true) {
      const match = digitRegex.exec(line);
      if (match == null) {
        break;
      }

      numbers.push({
        coord: {
          rowIdx,
          colIdx: match.index,
          length: match[0].length,
        },
        n: parseFloat(match[0]),
      });
    }
  }

  let sum = 0;
  const gears: {
    [gearKey: string]: GridNumber[];
  } = {};
  for (const n of numbers) {
    console.log('n: ', n);
    const adjacentGears = findAdjacentGears(n.coord, data);
    for (const gearCoord of adjacentGears) {
      const key = gearKey(gearCoord);
      if (!gears[key]) {
        gears[key] = [];
      }

      gears[key].push(n);
    }
  }

  for (const gearKey in gears) {
    const gearNumbers = gears[gearKey];
    if (gearNumbers.length == 2) {
      console.log('found gear: ', gearKey);
      console.log('numbers: ', gearNumbers);
      sum += gearNumbers[0].n * gearNumbers[1].n;
    }
  }
  return sum;
}

function gearKey(coord: GridCoord) {
  return coord.rowIdx + ':' + coord.colIdx + ':' + coord.length;
}

function findAdjacentGears(coord: GridCoord, data: string[]): GridCoord[] {
  const gearCoords: GridCoord[] = [];
  for (const rowIdx of rowRange(coord, data)) {
    for (const colIdx of colRange(coord, data)) {
      if (data[rowIdx][colIdx] == '*') {
        gearCoords.push({
          rowIdx,
          colIdx,
          length: 1,
        });
      }
    }
  }

  return gearCoords;
}

function rowRange(coord: GridCoord, data: string[]) {
  return _.range(
    constrain(coord.rowIdx - 1, 0, data.length),
    constrain(coord.rowIdx + 2, 0, data.length),
  );
}

function colRange(coord: GridCoord, data: string[]) {
  return _.range(
    constrain(coord.colIdx - 1, 0, data[0].length),
    constrain(coord.colIdx + coord.length + 1, 0, data[0].length),
  );
}

function constrain(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

const answer = await day3b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
