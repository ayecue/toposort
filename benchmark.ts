import * as fastToposort from './src';
const toposort = require('toposort');
const batchingToposort = require('batching-toposort');
import { toposort as seriouscoderoneToposort } from '@seriouscoderone/toposort';
import { toposort as n1ru4lToposort } from "@n1ru4l/toposort";
import { diff } from 'deep-object-diff';

// generate mock data
function generateMock() {
  const nodes = Array.from({ length: 1000 }, (_, i) => `node${i}`);
  const edges: [string, string][] = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push([nodes[i], nodes[i + 1]]);
    if (i % 10 === 0 && i + 10 < nodes.length) {
      edges.push([nodes[i], nodes[i + 10]]);
    }
    if (i % 100 === 0 && i + 100 < nodes.length) {
      edges.push([nodes[i], nodes[i + 100]]);
    }
  }

  const graph: Record<string, string[]> = {};
  nodes.forEach(node => graph[node] = []);
  edges.forEach(([from, to]) => graph[from].push(to));

  const graphMap: [string, string[]][] = [];
  Object.keys(graph).forEach(key => graphMap.push([key, graph[key]]));

  return {
    nodes,
    edges,
    graph,
    graphMap
  }
}

const { nodes, edges, graph, graphMap } = generateMock();
const iterations = 10000;
const output: Record<string, string[]> = {};

function benchmark(name: string, fn: any, normalize: (input: any) => string[] = (input: any) => input) {
  output[name] = normalize(fn());
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  console.log('-', name, Date.now() - start, 'ms');
}

const normalizeBatchingToposort = (output: ReturnType<typeof batchingToposort>) => {
  return output.flat() as string[];
};

const normalizeN1ru4lToposort = (output: ReturnType<typeof n1ru4lToposort>) => {
  const result: string[] = [];
  for (const taskList of output) {
    result.push(...taskList);
  }
  return result;
};

console.log(`Benchmarking with ${nodes.length} nodes and ${edges.length} edges (${iterations} iterations)`);
benchmark('fast-toposort', () => fastToposort.toposort(nodes, edges));
benchmark('toposort', () => toposort.array(nodes, edges));
benchmark('batching-toposort', () => batchingToposort(graph), normalizeBatchingToposort);
benchmark('@seriouscoderone/toposort', () => seriouscoderoneToposort(nodes, edges));
benchmark('@n1ru4l/toposort', () => n1ru4lToposort(new Map(graphMap)), normalizeN1ru4lToposort);


console.log('Comparing results...');
const diff1 = diff(output['fast-toposort'], output['toposort']);
const diff2 = diff(output['fast-toposort'], output['batching-toposort']);
const diff3 = diff(output['fast-toposort'], output['@seriouscoderone/toposort']);
const diff4 = diff(output['fast-toposort'], output['@n1ru4l/toposort']);

console.log('fast-toposort vs toposort:', Object.values(diff1).length === 0 ? 'No difference' : diff1);
console.log('fast-toposort vs batching-toposort:', Object.values(diff2).length === 0 ? 'No difference' : diff2);
console.log('fast-toposort vs @seriouscoderone/toposort:', Object.values(diff3).length === 0 ? 'No difference' : diff3);
console.log('fast-toposort vs @n1ru4l/toposort:', Object.values(diff4).length === 0 ? 'No difference' : diff4);