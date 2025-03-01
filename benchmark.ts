import * as fastToposort from './src';
const toposort = require('toposort');
const batchingToposort = require('batching-toposort');
import { toposortExtra } from '@seriouscoderone/toposort';
import { toposort as n1ru4lToposort } from "@n1ru4l/toposort";

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

function benchmark(name: string, fn: any) {
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  console.log('-', name, Date.now() - start, 'ms');
}

console.log(`Benchmarking with ${nodes.length} nodes and ${edges.length} edges (${iterations} iterations)`);
benchmark('fast-toposort', () => fastToposort.toposort(nodes, edges));
benchmark('toposort', () => toposort.array(nodes, edges));
benchmark('batching-toposort', () => batchingToposort(graph));
benchmark('@seriouscoderone/toposort', () => toposortExtra({ nodes, edges }));
benchmark('@n1ru4l/toposort', () => n1ru4lToposort(new Map(graphMap)));