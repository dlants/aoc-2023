import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

export async function day12b(dataPath?: string) {
  const data = await readData(dataPath);
  let sum = 0;
  for (const line of data) {
    if (!line) {
      continue;
    }

    console.log(line);
    const [springs, check] = line.split(' ');
    const groups: number[] = check.split(',').map(parseFloat);
    // const num = waysToMatchGroups(springs, groups);
    const num = waysToMatchGroups(x5(springs).join('?'), _.flatten(x5(groups)));
    console.log(num);
    sum += num;
  }
  return sum;
}

type Subproblem = {
  springs: string;
  groups: number[];
};

function waysToMatchGroups(springs: string, groups: number[]): number {
  const cache: { [key: string]: number } = {};

  function cachedSolveSubproblem({ springs, groups }: Subproblem) {
    const key = `${springs};${groups.join(',')}`;
    if (cache[key]) {
      return cache[key];
    }
    const solution = solveSubproblem({ springs, groups });
    cache[key] = solution;
    return solution;
  }

  function solveSubproblem({ springs, groups }: Subproblem) {
    if (groups.length == 0) {
      if (allCharactersMatch(springs, '?.')) {
        return 1;
      } else {
        return 0;
      }
    }
    const groupIdx = Math.floor(groups.length / 2);
    const groupSize = groups[groupIdx];

    let sum = 0;
    for (
      let groupStartIdx = 0;
      groupStartIdx < springs.length;
      groupStartIdx += 1
    ) {
      if (isValidGroupAssignment(springs, groupStartIdx, groupSize)) {
        const lhsSprings = springs.slice(0, Math.max(groupStartIdx - 1, 0));
        const lhsGroups = groups.slice(0, groupIdx);
        const rhsSprings = springs.slice(
          Math.min(springs.length, groupStartIdx + groupSize + 1),
          springs.length,
        );
        const rhsGroups = groups.slice(groupIdx + 1);

        // console.log(
        //   `decomposed "${springs}" into "${lhsSprings}.${groupSize}.${rhsSprings}"`,
        // );

        const lhs = cachedSolveSubproblem({
          springs: lhsSprings,
          groups: lhsGroups,
        });

        if (lhs > 0) {
          const rhs = cachedSolveSubproblem({
            springs: rhsSprings,
            groups: rhsGroups,
          });
          sum += lhs * rhs;
        }
      }
    }

    return sum;
  }

  return cachedSolveSubproblem({ springs, groups });
}

function isValidGroupAssignment(
  springs: string,
  startIdx: number,
  groupSize: number,
): boolean {
  // the character before is a '.' or a '?'
  if (
    !(
      startIdx == 0 ||
      springs[startIdx - 1] == '.' ||
      springs[startIdx - 1] == '?'
    )
  ) {
    return false;
  }

  // the character after is a '.' or a '?'
  const endIdx = startIdx + groupSize;
  if (
    !(
      endIdx == springs.length ||
      springs[endIdx] == '.' ||
      springs[endIdx] == '?'
    )
  ) {
    return false;
  }

  // all characters between are '#' or '?'
  if (!allCharactersMatch(springs.slice(startIdx, endIdx), '#?')) {
    return false;
  }

  return true;
}

function allCharactersMatch(springs: string, characters: string) {
  for (let idx = 0; idx < springs.length; idx += 1) {
    if (characters.indexOf(springs[idx]) == -1) {
      return false;
    }
  }

  return true;
}

const answer = await day12b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

function x5<T>(val: T) {
  return [val, val, val, val, val];
}
