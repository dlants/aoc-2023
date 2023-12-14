import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day12a(dataPath?: string) {
  const data = await readData(dataPath);
  let sum = 0;
  for (const line of data) {
    if (!line) {
      continue;
    }

    const [springs, check] = line.split(' ');
    const groups: number[] = check.split(',').map(parseFloat);
    sum += waysToMatchGroups(springs, 0, groups);
  }
  return sum;
}

function waysToMatchGroups(
  springs: string,
  currentGroup: number,
  groups: number[],
): number {
  if (springs.length == 0) {
    if (groups.length == 0) {
      if (currentGroup == 0) {
        return 1;
      } else {
        return 0;
      }
    } else if (groups.length == 1 && groups[0] == currentGroup) {
      return 1;
    } else {
      return 0;
    }
  }

  switch (springs[0]) {
    case '.':
      if (currentGroup == 0) {
        return waysToMatchGroups(springs.slice(1), 0, groups);
      } else if (groups[0] == currentGroup) {
        return waysToMatchGroups(springs.slice(1), 0, groups.slice(1));
      } else {
        return 0;
      }
    case '#':
      return waysToMatchGroups(springs.slice(1), currentGroup + 1, groups);
    case '?':
      return (
        waysToMatchGroups('#' + springs.slice(1), currentGroup, groups) +
        waysToMatchGroups('.' + springs.slice(1), currentGroup, groups)
      );
  }
}

const answer = await day12a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
