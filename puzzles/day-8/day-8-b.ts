import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from 'lodash';

type Node = {
  id: string;
  left: string;
  right: string;
};

type NodeMap = {
  [nodeId: string]: Node;
};

export async function day8b(dataPath?: string) {
  const data = await readData(dataPath);
  const directions = data[0];

  const nodeMap: NodeMap = {};
  for (const lineIdx of _.range(2, data.length)) {
    const line = data[lineIdx];
    if (line.length == 0) {
      continue;
    }
    const node = parseNode(line);
    nodeMap[node.id] = node;
  }

  const starterNodes = [];
  for (const nodeId in nodeMap) {
    if (nodeId[2] == 'A') {
      starterNodes.push(nodeId);
    }
  }

  const numRepeatsPerNode = starterNodes.map((starterNode) => {
    let numRepeats = 0;
    let currentNode = starterNode;
    while (true) {
      numRepeats += directions.length;
      currentNode = traverseNodes(nodeMap, currentNode, directions);
      if (currentNode[2] == 'Z') {
        break;
      }
    }

    return numRepeats;
  });

  console.log('numRepeatsPerNode: ', numRepeatsPerNode);

  return _.reduce(numRepeatsPerNode, lcm, 1);
}

function gcd(num1: number, num2: number) {
  let a = num1;
  let b = num2;

  while (a % b > 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return b;
}

function lcm(num1: number, num2: number) {
  return (num1 * num2) / gcd(num1, num2);
}

function parseNode(line: string) {
  const [nodeId, childNodes] = line.split(' = ');
  const childNodesTrimmed = childNodes.substr(1, childNodes.length - 2); // trim parens
  const [left, right] = childNodesTrimmed.split(', ');

  return {
    id: nodeId,
    left,
    right,
  };
}

function traverseNodes(
  nodeMap: NodeMap,
  startingNode: string,
  directions: string,
) {
  let currentNode = startingNode;
  for (const dir of directions) {
    if (dir == 'L') {
      currentNode = nodeMap[currentNode].left;
    } else {
      currentNode = nodeMap[currentNode].right;
    }
  }

  return currentNode;
}

const answer = await day8b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
