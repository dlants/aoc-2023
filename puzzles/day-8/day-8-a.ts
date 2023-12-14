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

export async function day8a(dataPath?: string) {
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

  let numRepeats = 0;
  let currentNode = 'AAA';
  while (true) {
    numRepeats += directions.length;
    currentNode = traverseNodes(nodeMap, currentNode, directions);
    if (currentNode == 'ZZZ') {
      break;
    }
  }

  return numRepeats;
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

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
