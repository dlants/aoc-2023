import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

type Coord = {
  rowIdx: number;
  colIdx: number;
};

export async function day11b(dataPath?: string) {
  const data = await readData(dataPath);
  console.log(data);
  let grid: string[][] = [];
  for (const line of data) {
    if (line) {
      grid.push(line.split(''));
    }
  }

  const emptyRowIdxs: Set<number> = new Set();
  grid.forEach((row, rowIdx) => {
    if (_.every(row, (tile) => tile == '.')) {
      emptyRowIdxs.add(rowIdx);
    }
  });

  const emptyColidxs: Set<number> = new Set();
  for (const colIdx of _.range(grid[0].length)) {
    if (
      _.every(
        grid.map((r) => r[colIdx]),
        (tile) => tile == '.',
      )
    ) {
      emptyColidxs.add(colIdx);
    }
  }

  const galaxies = findGalaxies(grid);
  let sum = 0;
  for (const idx1 of _.range(galaxies.length)) {
    for (const idx2 of _.range(idx1 + 1, galaxies.length)) {
      sum += distance(galaxies[idx1], galaxies[idx2], {
        emptyRowIdxs,
        emptyColidxs,
      });
    }
  }

  return sum;
}

function findGalaxies(grid: string[][]) {
  const galaxies: Coord[] = [];
  grid.forEach((row, rowIdx) => {
    row.forEach((tile, colIdx) => {
      if (tile == '#') {
        galaxies.push({ rowIdx, colIdx });
      }
    });
  });

  return galaxies;
}

const EXPANSION = 1000000;

function distance(
  c1: Coord,
  c2: Coord,
  {
    emptyRowIdxs,
    emptyColidxs,
  }: { emptyColidxs: Set<number>; emptyRowIdxs: Set<number> },
) {
  let dist = 0;
  for (const rowIdx of _.range(Math.min(c1.rowIdx, c2.rowIdx), Math.max(c1.rowIdx, c2.rowIdx))) {
    if (emptyRowIdxs.has(rowIdx)) {
      dist += EXPANSION
    } else {
      dist += 1
    }
  }

  for (const colIdx of _.range(Math.min(c1.colIdx, c2.colIdx), Math.max(c1.colIdx, c2.colIdx))) {
    if (emptyColidxs.has(colIdx)) {
      dist += EXPANSION
    } else {
      dist += 1
    }
  }


  return dist;
}

const answer = await day11b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
