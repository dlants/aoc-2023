import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

const CARD_ORDER = 'AKQT98765432J';

type HandCount = {
  [card: string]: number;
};

type HandWithBid = {
  cards: string;
  count: HandCount;
  bid: number;
};

export async function day7b(dataPath?: string) {
  const data = await readData(dataPath);
  const hands: HandWithBid[] = [];
  for (const line of data) {
    if (line.length == 0) {
      continue;
    }

    hands.push(parseHand(line));
  }

  hands.sort(compareHands);
  for (const hand of hands) {
    console.log(
      hand.cards +
        ' ' +
        JSON.stringify(hand.count) +
        ' ' +
        JSON.stringify(findHandFrequencies(hand)),
    );
  }
  return _.reduce(
    hands.map((hand, idx) => hand.bid * (idx + 1)),
    (a, b) => a + b,
    0,
  );
}

function parseHand(line: string) {
  const [cards, bid] = line.split(' ');
  const count: HandCount = {};
  for (const card of cards) {
    if (count[card]) {
      count[card] += 1;
    } else {
      count[card] = 1;
    }
  }

  return {
    count,
    cards,
    bid: parseFloat(bid),
  };
}

function compareHands(hand1: HandWithBid, hand2: HandWithBid) {
  const freqs1 = findHandFrequencies(hand1);
  const freqs2 = findHandFrequencies(hand2);

  for (const freqIdx of _.range(0, 5)) {
    const freq1 = freqs1[freqIdx] || 0;
    const freq2 = freqs2[freqIdx] || 0;

    const diff = freq1 - freq2;

    if (diff != 0) {
      return diff;
    }
  }

  // the hands have teh same order. Sort by the card order instead
  for (const cardIdx of _.range(0, 5)) {
    const ord1 = CARD_ORDER.indexOf(hand1.cards[cardIdx]);
    const ord2 = CARD_ORDER.indexOf(hand2.cards[cardIdx]);
    const diff = ord2 - ord1; //reversed because a lower index means a higher card
    if (diff != 0) {
      return diff;
    }
  }

  return 0;
}

function findHandFrequencies(hand: HandWithBid) {
  const countCopy = { ...hand.count };
  const jokerFrequency = countCopy['J'] || 0;
  delete countCopy['J'];

  const sortedFreqs = _.values(countCopy).sort().reverse();
  if (sortedFreqs.length) {
    sortedFreqs[0] += jokerFrequency;
  } else {
    sortedFreqs.push(jokerFrequency);
  }
  return sortedFreqs;
}

const answer = await day7b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
