import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

type Range = {
  start: number;
  /** non-inclusive **/
  end: number;
};

type RangeTransform = {
  source: Range;
  destinationStart: number;
};

type Almanac = {
  seeds: number[];
  maps: {
    mapName: string;
    transforms: RangeTransform[];
  }[];
};

export async function day5b(dataPath?: string) {
  const data = await readData(dataPath);
  const almanac = parseAlmanac(data);

  const seedRanges: Range[] = [];
  for (let seedIdx = 0; seedIdx < almanac.seeds.length; seedIdx += 2) {
    const start = almanac.seeds[seedIdx];
    const length = almanac.seeds[seedIdx + 1];
    seedRanges.push({ start, end: start + length });
  }
  const locationRanges = mapSeedRanges(seedRanges, almanac);
  return _.min(locationRanges.map((range) => range.start));
}

type ParserState =
  | {
      state: 'new-map';
    }
  | {
      state: 'map-body';
      mapName: string;
      transforms: RangeTransform[];
    };

function parseAlmanac(data: string[]) {
  const [_, seedsStr] = data[0].split(': ');

  const maps: Almanac['maps'] = [];

  let lineIdx = 2;
  let state: ParserState = { state: 'new-map' };
  while (lineIdx < data.length) {
    const line = data[lineIdx];
    switch (state.state) {
      case 'new-map':
        state = {
          state: 'map-body',
          mapName: parseMapHeader(line),
          transforms: [],
        };
        break;
      case 'map-body':
        if (line.length) {
          state.transforms.push(parseTransform(line));
        } else {
          maps.push({
            mapName: state.mapName,
            transforms: state.transforms,
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

function parseTransform(line: string) {
  const [destinationStart, sourceStart, length] = line
    .split(' ')
    .map(parseFloat);
  return {
    destinationStart,
    source: { start: sourceStart, end: sourceStart + length },
  };
}

function mapSeedRanges(seedRanges: Range[], almanac: Almanac) {
  let currentRanges = seedRanges;

  for (const map of almanac.maps) {
    let workspaceRanges: RangeResult[] = currentRanges.map((range) => ({
      ...range,
      mapped: false,
    }));

    for (const transform of map.transforms) {
      const resultRanges = [];
      for (const inputRange of workspaceRanges) {
        if (!inputRange.mapped) {
          resultRanges.push(...applyTransform(inputRange, transform));
        } else {
          resultRanges.push(inputRange);
        }
      }

      workspaceRanges = resultRanges;
    }

    currentRanges = workspaceRanges.map((range) => ({
      start: range.start,
      end: range.end,
    }));
  }

  return currentRanges;
}

type RangeResult = Range & { mapped: boolean };

function applyTransform(
  range: Range,
  transform: RangeTransform,
): RangeResult[] {
  const intersection = intersect(range, transform.source);
  if (intersection == undefined) {
    // transform does not apply
    return [{ ...range, mapped: false }];
  }

  const { start: intersectionStart, end: intersectionEnd } = intersection;

  const result: RangeResult[] = [];
  if (range.start < intersectionStart) {
    const left = {
      start: range.start,
      end: intersectionStart,
      mapped: false,
    };
    // not affected by transform
    result.push(left);
  }

  result.push({
    start:
      intersectionStart - transform.source.start + transform.destinationStart,
    end: intersectionEnd - transform.source.start + transform.destinationStart,
    mapped: true,
  });

  if (intersectionEnd < range.end) {
    const right = {
      start: intersectionEnd,
      end: range.end,
      mapped: false,
    };

    // not affected by transform
    result.push(right);
  }

  return result;
}

function intersect(range1: Range, range2: Range): Range | undefined {
  const start = Math.max(range1.start, range2.start);
  const end = Math.min(range1.end, range2.end);

  if (start > end) {
    return undefined;
  }

  return { start, end };
}

const answer = await day5b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
