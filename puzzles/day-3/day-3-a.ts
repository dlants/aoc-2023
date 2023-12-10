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

export async function day3a(dataPath?: string) {
  const data = await readData(dataPath);
  if (data[data.length - 1] == '') {
    data.pop()
  }

  const numbers: GridNumber[] = [];
  for(const line of data) {
    console.log(line)
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
  for (const n of numbers) {
    console.log('n: ', n)
    if (hasAdjacentSymbol(n.coord, data)) {
      console.log('number hasAdjacentSymbol: ', n.n)
      sum += n.n;
    }
  }
  return sum;
}

function hasAdjacentSymbol(coord: GridCoord, data: string[]) {
  function coordIsSymbol(rowIdx: number, colIdx: number) {
    const char = data[rowIdx][colIdx];
    if (char == '.') {
      return false;
    }
    if (/\d/.test(char)) {
      return false;
    }

    return true;
  }

  console.log('coord: ', coord)
  console.log('rowRange: ', rowRange(coord, data))
  console.log('colRange: ', colRange(coord, data))
  for (const rowIdx of rowRange(coord, data)) {
    for (const colIdx of colRange(coord, data)) {
      if (coordIsSymbol(rowIdx, colIdx)) {
        return true;
      }
    }
  }

  return false;
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

const answer = await day3a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
