import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

type Coord = {
  rowIdx: number;
  colIdx: number;
};

type Probe = {
  currentCoord: Coord;
  nextCoord: Coord;
  distance: number;
  path: Coord[];
};

type DistandeMapEntry = {
  symbol?: string;
  distance: number;
  path?: Coord[];
};

export async function day10b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((line) => line);
  const loop = findLoop(data);

  const grid: string[][] = [];
  for (const line of data) {
    const gridLine = [];
    for (const char of line) {
      if (char == '.') {
        gridLine.push('.');
      } else if (char == 'S') {
        gridLine.push(figureOutStartTile(loop));
      } else {
        gridLine.push('.');
      }
    }
    grid.push(gridLine);
  }

  for (const coord of loop) {
    grid[coord.rowIdx][coord.colIdx] = data[coord.rowIdx][coord.colIdx];
  }

  let innerCount = 0;
  for (const rowIdx of _.range(grid.length)) {
    for (const colIdx of _.range(grid[rowIdx].length)) {
      if (grid[rowIdx][colIdx] == '.') {
        const verticalPipeCount = countCrossingsRight({ rowIdx, colIdx }, grid);
        if (verticalPipeCount % 2 == 0) {
          grid[rowIdx][colIdx] = 'O';
        } else {
          grid[rowIdx][colIdx] = 'I';
          innerCount += 1;
        }
      }
    }
  }

  for (const row of grid) {
    console.log(row.join(''));
  }

  return innerCount;
}

function figureOutStartTile(loop: Coord[]) {
  const startCoord = loop[0];
  const nextCoord = loop[1];
  const prevCoord = loop[loop.length - 1];

  if (equal(up(startCoord), nextCoord)) {
    if (equal(down(startCoord), prevCoord)) {
      return '|'
    }
    if (equal(left(startCoord), prevCoord)) {
      return 'J'
    }
    if (equal(right(startCoord), prevCoord)) {
      return 'L'
    }
  }

  if (equal(down(startCoord), nextCoord)) {
    if (equal(up(startCoord), prevCoord)) {
      return '|'
    }
    if (equal(left(startCoord), prevCoord)) {
      return '7'
    }
    if (equal(right(startCoord), prevCoord)) {
      return 'F'
    }
  }

  if (equal(left(startCoord), nextCoord)) {
    if (equal(right(startCoord), prevCoord)) {
      return '-'
    }
    if (equal(up(startCoord), prevCoord)) {
      return 'J'
    }
    if (equal(down(startCoord), prevCoord)) {
      return '7'
    }
  }

  if (equal(right(startCoord), nextCoord)) {
    if (equal(left(startCoord), prevCoord)) {
      return '-'
    }
    if (equal(up(startCoord), prevCoord)) {
      return 'L'
    }
    if (equal(down(startCoord), prevCoord)) {
      return 'F'
    }
  }

  throw new Error(`Cannot figure out start coord`)
}

function countCrossingsRight(coord: Coord, grid: string[][]) {
  let count = 0;
  let lastCorner = '';
  for (const colIdx of _.range(coord.colIdx, grid[0].length)) {
    switch (grid[coord.rowIdx][colIdx]) {
      case '|':
        count += 1;
        lastCorner = '';
        break;

      // FJ or L7 are also crossings
      case 'J':
        if (lastCorner == 'F') {
          count += 1;
        }
        lastCorner = '';
        break;

      case '7':
        if (lastCorner == 'L') {
          count += 1;
        }
        lastCorner = '';
        break;

      case 'F':
        lastCorner = 'F';
        break;

      case 'L':
        lastCorner = 'L';
        break;
    }
  }

  return count;
}

function findLoop(data: string[]): Coord[] {
  const distanceMap: DistandeMapEntry[][] = [];
  for (const line of data) {
    distanceMap.push(
      _.range(line.length).map(() => ({
        distance: 0,
      })),
    );
  }

  const startCoord = findStart(data);
  distanceMap[startCoord.rowIdx][startCoord.colIdx].symbol = 'S';
  let probes: Probe[] = [
    {
      currentCoord: startCoord,
      nextCoord: up(startCoord),
      distance: 0,
      path: [],
    },
    {
      currentCoord: startCoord,
      nextCoord: down(startCoord),
      distance: 0,
      path: [],
    },
    {
      currentCoord: startCoord,
      nextCoord: left(startCoord),
      distance: 0,
      path: [],
    },
    {
      currentCoord: startCoord,
      nextCoord: right(startCoord),
      distance: 0,
      path: [],
    },
  ];

  while (probes.length > 0) {
    const nextProbes = [];
    for (const probe of probes) {
      try {
        const nextCoord = traversePipe(
          probe.currentCoord,
          probe.nextCoord,
          data,
        );
        nextProbes.push({
          currentCoord: probe.nextCoord,
          nextCoord,
          distance: probe.distance + 1,
          path: [...probe.path, probe.nextCoord],
        });
      } catch {
        // probe died
      }
    }

    probes = nextProbes;

    for (const probe of probes) {
      const currDistance =
        distanceMap[probe.currentCoord.rowIdx][probe.currentCoord.colIdx];
      if (currDistance.distance != 0) {
        // we've visited this location before!
        return [startCoord, ...currDistance.path, ...probe.path.reverse()];
      }
      distanceMap[probe.currentCoord.rowIdx][probe.currentCoord.colIdx] = {
        distance: probe.distance,
        path: probe.path,
      };
    }
  }
}

function findStart(data: string[]) {
  for (const rowIdx of _.range(data.length)) {
    const colIdx = data[rowIdx].indexOf('S');
    if (colIdx != -1) {
      return { rowIdx, colIdx };
    }
  }
}

/* Traverse the pipe at location coord,
 **/
function traversePipe(
  startCoord: Coord,
  tileCoord: Coord,
  data: string[],
): Coord {
  const tile = data[tileCoord.rowIdx][tileCoord.colIdx];

  switch (tile) {
    case '|': {
      if (isAbove(startCoord, tileCoord)) {
        return down(tileCoord);
      }

      if (isBelow(startCoord, tileCoord)) {
        return up(tileCoord);
      }
      break;
    }

    case '-': {
      if (isLeftOf(startCoord, tileCoord)) {
        return right(tileCoord);
      }

      if (isRightOf(startCoord, tileCoord)) {
        return left(tileCoord);
      }
      break;
    }

    case 'L': {
      if (isAbove(startCoord, tileCoord)) {
        return right(tileCoord);
      }

      if (isRightOf(startCoord, tileCoord)) {
        return up(tileCoord);
      }
      break;
    }

    case 'J': {
      if (isAbove(startCoord, tileCoord)) {
        return left(tileCoord);
      }

      if (isLeftOf(startCoord, tileCoord)) {
        return up(tileCoord);
      }
      break;
    }

    case '7': {
      if (isBelow(startCoord, tileCoord)) {
        return left(tileCoord);
      }

      if (isLeftOf(startCoord, tileCoord)) {
        return down(tileCoord);
      }
      break;
    }

    case 'F': {
      if (isBelow(startCoord, tileCoord)) {
        return right(tileCoord);
      }

      if (isRightOf(startCoord, tileCoord)) {
        return down(tileCoord);
      }
      break;
    }
  }

  throw new Error(
    `cannot traverse tile ${tile} at coordinate ${tileCoord} from ${startCoord}`,
  );
}

// increasing rowIdx is lower
// increasing colIdx is to the right
function isAbove(coord1: Coord, coord2: Coord) {
  return equal(coord1, up(coord2));
}
function isBelow(coord1: Coord, coord2: Coord) {
  return equal(coord1, down(coord2));
}
function isLeftOf(coord1: Coord, coord2: Coord) {
  return equal(coord1, left(coord2));
}
function isRightOf(coord1: Coord, coord2: Coord) {
  return equal(coord1, right(coord2));
}

function equal(coord1: Coord, coord2: Coord) {
  return coord1.rowIdx == coord2.rowIdx && coord1.colIdx == coord2.colIdx;
}

function up(coord: Coord) {
  return {
    rowIdx: coord.rowIdx - 1,
    colIdx: coord.colIdx,
  };
}

function down(coord: Coord) {
  return {
    rowIdx: coord.rowIdx + 1,
    colIdx: coord.colIdx,
  };
}

function left(coord: Coord) {
  return {
    rowIdx: coord.rowIdx,
    colIdx: coord.colIdx - 1,
  };
}

function right(coord: Coord) {
  return {
    rowIdx: coord.rowIdx,
    colIdx: coord.colIdx + 1,
  };
}

const answer = await day10b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
