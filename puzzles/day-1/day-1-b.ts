import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

const DIGITS = '0123456789';
const NUMBERS = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

export async function day1b(dataPath?: string) {
  const data = await readData(dataPath);
  let sum = 0;
  for (let line of data) {
    console.log(line)
    let firstDigit = undefined;
    let lastDigit = undefined;

    for (const charIdx of _.range(0, line.length)) {
      const char = line[charIdx];
      let foundDigit = undefined;
      if (DIGITS.indexOf(char) != -1) {
        foundDigit = char;
      }

      for (const numberStr in NUMBERS) {
        if (line.substr(charIdx, numberStr.length) == numberStr) {
          foundDigit = NUMBERS[numberStr];
        }
      }

      if (foundDigit != undefined) {
        console.log('found digit', foundDigit)
        if (firstDigit == undefined) {
          firstDigit = foundDigit;
          lastDigit = foundDigit;
        } else {
          lastDigit = foundDigit;
        }
      }
    }

    if (firstDigit != undefined) {
      console.log(firstDigit + lastDigit)
      sum += parseFloat(firstDigit + lastDigit);
      console.log('new sum: ', sum)
    }
  }
  return sum;
}

const answer = await day1b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
