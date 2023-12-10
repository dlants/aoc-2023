import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

type Range = {
  sourceStart: number;
  destinationStart: number;
  length: number;
};

type Almanac = {
  seeds: number[];
  maps: {
    mapName: string;
    ranges: Range[];
  }[];
};

export async function day5a(dataPath?: string) {
  const data = await readData(dataPath);
  const almanac = parseAlmanac(data);

  const locations = almanac.seeds.map((seed) => mapSeed(seed, almanac));
  return _.min(locations);
}

type ParserState =
  | {
      state: 'new-map';
    }
  | {
      state: 'map-body';
      mapName: string;
      ranges: Range[];
    };

function parseAlmanac(data: string[]) {
  const [_, seedsStr] = data[0].split(': ');

  const maps: Almanac['maps'] = [];

  let lineIdx = 2;
  let state: ParserState = { state: 'new-map' };
  while (lineIdx < data.length) {
    const line = data[lineIdx];
    console.log(line);
    switch (state.state) {
      case 'new-map':
        state = {
          state: 'map-body',
          mapName: parseMapHeader(line),
          ranges: [],
        };
        break;
      case 'map-body':
        if (line.length) {
          state.ranges.push(parseRange(line));
        } else {
          maps.push({
            mapName: state.mapName,
            ranges: state.ranges,
          });

          state = { state: 'new-map' };
        }
        break;
    }
    lineIdx += 1;
  }

  return {
    seeds: seedsStr.split(' ').map(parseFloat),
    maps,
  };
}

function parseMapHeader(line: string) {
  return line.split(' ')[0];
}

function parseRange(line: string) {
  const [destinationStart, sourceStart, length] = line
    .split(' ')
    .map(parseFloat);
  return { destinationStart, sourceStart, length };
}

function mapSeed(seed: number, almanac: Almanac) {
  let currentId = seed;
  for (const map of almanac.maps) {
    console.log('map: ', map);
    let mapped = false;
    for (const range of map.ranges) {
      const mappedId = mapRange(currentId, range);
      if (mappedId != undefined) {
        console.log(`Map ${map.mapName} mapped ${currentId} to ${mappedId}`);

        currentId = mappedId;
        mapped = true;
        break;
      }
    }

    // if the id wasn't mapped by one of the ranges, it stays the same
    if (!mapped) {
      console.log(`Map ${map.mapName} did not remap ${currentId}`);
    }
  }

  console.log(`Mapped seed ${seed} to location ${currentId}`);
  console.log('\n');
  return currentId;
}

function mapRange(id: number, range: Range) {
  if (range.sourceStart <= id && id < range.sourceStart + range.length) {
    return id - range.sourceStart + range.destinationStart;
  }

  return undefined;
}

const answer = await day5a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
