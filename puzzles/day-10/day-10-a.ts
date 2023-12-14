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
};

export async function day10a(dataPath?: string) {
  const data = await readData(dataPath);
  const distanceMap = [];
  for (const line of data) {
    distanceMap.push(_.range(line.length).map(() => 0));
  }

  const startCoord = findStart(data);
  distanceMap[startCoord.rowIdx][startCoord.colIdx] = 'S';
  let probes: Probe[] = [
    {
      currentCoord: startCoord,
      nextCoord: up(startCoord),
      distance: 0,
    },
    {
      currentCoord: startCoord,
      nextCoord: down(startCoord),
      distance: 0,
    },
    {
      currentCoord: startCoord,
      nextCoord: left(startCoord),
      distance: 0,
    },
    {
      currentCoord: startCoord,
      nextCoord: right(startCoord),
      distance: 0,
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
        });
      } catch {
        // probe died
      }
    }

    probes = nextProbes;

    for (const probe of probes) {
      const currDistance =
        distanceMap[probe.currentCoord.rowIdx][probe.currentCoord.colIdx];
      if (currDistance != 0) {
        // we've visited this location before!
        return currDistance;
      }
      distanceMap[probe.currentCoord.rowIdx][probe.currentCoord.colIdx] =
        probe.distance;
    }

    // for (const line of distanceMap) {
    //   console.log(line.join(''));
    // }

    // console.log(' ');
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

const answer = await day10a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
