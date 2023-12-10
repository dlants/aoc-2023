import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

type ScratchCard = {
  cardId: string;
  winning: Set<number>;
  played: Set<number>;
};

export async function day4b(dataPath?: string) {
  const data = await readData(dataPath);

  const cards: {
    card: ScratchCard;
    wins: Set<number>;
    numCards: number;
  }[] = [];

  for (const line of data) {
    if (!line.length) {
      break;
    }

    const card = parseLine(line);
    const wins = intersect(card.winning, card.played);
    cards.push({
      card,
      wins,
      numCards: 1,
    });
  }

  for (const cardIdx of _.range(cards.length)) {
    const card = cards[cardIdx];
    if (card.wins.size) {
      console.log(`card ${cardIdx} has ${card.wins.size} winning numbers and won ${card.numCards} times.`)
      for (const winIdx of _.range(cardIdx + 1, cardIdx + card.wins.size + 1)) {
        console.log(`Getting ${card.numCards} extra copies of card ${winIdx}`)
        cards[winIdx].numCards += card.numCards;
      }
    }
  }

  return _.reduce(cards, (acc, card) => acc + card.numCards, 0);
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

function intersect<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  return new Set([...set1].filter((el) => set2.has(el)));
}

const answer = await day4b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
