import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

type Coord = {
  rowIdx: number;
  colIdx: number;
};

export async function day11a(dataPath?: string) {
  const data = await readData(dataPath);
  console.log(data);
  let grid: string[][] = [];
  for (const line of data) {
    if (line) {
      grid.push(line.split(''));
    }
  }

  // expand rows
  const grid2 = [];
  for (const row of grid) {
    if (_.every(row, (tile) => tile == '.')) {
      grid2.push([...row]);
    }
    grid2.push(row);
  }

  grid = grid2;

  for (const colIdx of _.range(grid[0].length).reverse()) {
    if (
      _.every(
        grid.map((r) => r[colIdx]),
        (tile) => tile == '.',
      )
    ) {
      for (const row of grid) {
        row.splice(colIdx, 0, '.');
      }
    }
  }
  printGrid(grid);
  const galaxies = findGalaxies(grid);
  let sum = 0;
  for (const idx1 of _.range(galaxies.length)) {
    for (const idx2 of _.range(idx1 + 1, galaxies.length)) {
      sum += distance(galaxies[idx1], galaxies[idx2]);
    }
  }

  return sum;
}

function printGrid(grid: string[][]) {
  console.log('grid: ');
  for (const row of grid) {
    console.log(row.join(''));
  }
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

function distance(c1: Coord, c2: Coord) {
  return Math.abs(c1.colIdx - c2.colIdx) + Math.abs(c1.rowIdx - c2.rowIdx);
}

const answer = await day11a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
