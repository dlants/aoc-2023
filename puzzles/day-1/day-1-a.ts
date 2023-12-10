import { readData } from '../../shared.ts';
import chalk from 'chalk';

const digits = '0123456789';

export async function day1a(dataPath?: string) {
  const data = await readData(dataPath);
  let sum = 0;
  for (const line of data) {
    let firstDigit = undefined;
    let lastDigit = undefined;

    for (const char of line) {
      if (digits.indexOf(char) != -1) {
        if (firstDigit == undefined) {
          firstDigit = char;
          lastDigit = char;
        } else {
          lastDigit = char;
        }
      }
    }

    if (firstDigit != undefined) {
      sum += parseFloat(firstDigit + lastDigit);
    }
  }
  return sum;
}

const answer = await day1a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
