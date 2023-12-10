import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

type ScratchCard = {
  cardId: string;
  winning: Set<number>;
  played: Set<number>;
};

export async function day4a(dataPath?: string) {
  const data = await readData(dataPath);
  let sum = 0;
  for (const line of data) {
    if (!line.length) {
      break;
    }

    const card = parseLine(line);
    const wins = intersect(card.winning, card.played);
    if (wins.size > 0) {
      sum += Math.pow(2, wins.size - 1);
    }
    console.log('card: ', card);
    console.log('wins: ', wins);
  }

  return sum;
}

function parseLine(line: string): ScratchCard {
  const [cardIdStr, cardData] = line.split(': ');
  const cardId = cardIdStr.split(' ')[1];
  const [winningStr, playedStr] = cardData.trim().split(' | ');
  return {
    cardId,
    winning: new Set(
      winningStr
        .split(' ')
        .filter((s) => s.length > 0)
        .map(parseFloat),
    ),
    played: new Set(
      playedStr
        .split(' ')
        .filter((s) => s.length > 0)
        .map(parseFloat),
    ),
  };
}

function intersect(set1: Set<unknown>, set2: Set<unknown>) {
  return new Set([...set1].filter((el) => set2.has(el)));
}

const answer = await day4a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
