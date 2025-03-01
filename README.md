# toposort

TopoSort is a simple and efficient topological sorting algorithm for directed graphs. It helps you determine a linear ordering of vertices such that for every directed edge `u -> v`, vertex `u` comes before `v` in the ordering.

## Features

- Efficient topological sorting using Kahn's Algorithm.
- Cycle detection to identify circular dependencies.
- About `2x` faster compared to established libraries.
  - Benchmarking with 1000 nodes and 1107 edges (10000 iterations)
    - fast-toposort: 1078 ms
    - toposort: 2466 ms
    - batching-toposort: 4432 ms
    - @seriouscoderone/toposort: 7576 ms
    - @n1ru4l/toposort: 2226 ms
- Supports ES Modules (ESM) and Node.js.

## Installation

You can install fast-toposort using npm:

```bash
npm install fast-toposort
```

## Usage

```ts
import { toposortWithGraph } from 'fast-toposort';

const graph = {
  'A': ['B', 'C'],
  'B': ['D', 'E'],
  'C': ['F'],
  'D': [],
  'E': ['F'],
  'F': []
};

try {
  const result = toposortWithGraph(graph);
  console.log('Topological Order:', result);
} catch (error) {
  console.error(error.message);
}
```

## API

`toposortWithGraph(graph: Record<string, string[]>): string[]`
- graph: An object representing the directed graph. The keys are node identifiers, and the values are arrays of neighboring nodes.
- returns: An array representing the topological order of the nodes.
- throws: An error if the graph contains a cycle.

`toposortWithEdges(edges: [string, string][]): string[]`
- edges: An array of tuples representing directed edges between nodes. Each tuple is of the form `[fromNode, toNode]`
- returns: An array representing the topological order of the nodes.
- throws: An error if the graph contains a cycle.

`toposort(nodes: string[], edges: [string, string][]): string[]`
- nodes: An array containing node identifiers.
- edges: An array of tuples representing directed edges between nodes. Each tuple is of the form `[fromNode, toNode]`
- returns: An array representing the topological order of the nodes.
- throws: An error if the graph contains a cycle.