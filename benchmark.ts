import * as fastToposort from './src';
const toposort = require('toposort');
const batchingToposort = require('batching-toposort');
import { toposort as seriouscoderoneToposort } from '@seriouscoderone/toposort';
import { toposort as n1ru4lToposort } from "@n1ru4l/toposort";
import { diff } from 'deep-object-diff';
const Benchmarkify = require("benchmarkify");

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

// Utils
function register(name: string, fn: any, normalize: (input: any) => string[] = (input: any) => input) {
  output[name] = normalize(fn());
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

// run benchmark
const { nodes, edges, graph, graphMap } = generateMock();
const output: Record<string, string[]> = {};

const fastToposortCallback = () => fastToposort.toposort(nodes, edges);
const toposortCallback = () => toposort.array(nodes, edges);
const batchingToposortCallback = () => batchingToposort(graph);
const seriouscoderoneToposortCallback = () => seriouscoderoneToposort(nodes, edges);
const n1ru4lToposortCallback = () => n1ru4lToposort(new Map(graphMap));

register('fast-toposort', fastToposortCallback);
register('toposort', toposortCallback);
register('batching-toposort', batchingToposortCallback, normalizeBatchingToposort);
register('@seriouscoderone/toposort', seriouscoderoneToposortCallback);
register('@n1ru4l/toposort', n1ru4lToposortCallback, normalizeN1ru4lToposort);

console.log('Comparing output...');
const diff1 = diff(output['fast-toposort'], output['toposort']);
const diff2 = diff(output['fast-toposort'], output['batching-toposort']);
const diff3 = diff(output['fast-toposort'], output['@seriouscoderone/toposort']);
const diff4 = diff(output['fast-toposort'], output['@n1ru4l/toposort']);

console.log('fast-toposort vs toposort:', Object.values(diff1).length === 0 ? 'No difference' : diff1);
console.log('fast-toposort vs batching-toposort:', Object.values(diff2).length === 0 ? 'No difference' : diff2);
console.log('fast-toposort vs @seriouscoderone/toposort:', Object.values(diff3).length === 0 ? 'No difference' : diff3);
console.log('fast-toposort vs @n1ru4l/toposort:', Object.values(diff4).length === 0 ? 'No difference' : diff4);

const benchmark = new Benchmarkify("Benchmark");

console.log('Start benchmark...');
benchmark.createSuite("toposearch", { time: 1000, description: "Testing toposearch" })
  .add('fast-toposort', fastToposortCallback)
  .add('toposort', toposortCallback)
  .add('batching-toposort', batchingToposortCallback)
  .add('@seriouscoderone/toposort', seriouscoderoneToposortCallback)
  .add('@n1ru4l/toposort', n1ru4lToposortCallback);

benchmark.run();