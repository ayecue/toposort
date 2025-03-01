// External types
export type Node = string;
export type EdgeObject = [Node, Node];
export type GraphObject = Record<Node, Node[]>;
export type EdgesObject = EdgeObject[];

// Internal types
export type NodeIdx = number;
export type RefMap = Map<Node, NodeIdx>;
export type Edge = [NodeIdx, NodeIdx];
export type Graph = Set<NodeIdx>[];

function buildGraphFromEdges(refMap: RefMap, edges: EdgesObject): Graph {
  const graph: Graph = new Array(refMap.size);
  for (let i = 0, len = refMap.size; i < len; i++) {
    graph[i] = new Set<NodeIdx>();
  }
  for (let i = 0, len = edges.length; i < len; i++) {
    const [node, neighbor] = edges[i]
    const nodeIdx = refMap.get(node);
    const neighborIdx = refMap.get(neighbor);
    if (nodeIdx == null || neighborIdx == null) continue;
    graph[nodeIdx].add(neighborIdx);
  }
  return graph;
}

function buildRefMap(nodes: Node[]): RefMap {
  const refMap = new Map<Node, NodeIdx>();
  for (let i = 0, len = nodes.length; i < len; i++) {
    refMap.set(nodes[i], i)
  }
  return refMap
}

export function toposortWithEdges(edges: EdgesObject): Node[] {
  const nodes = Array.from(new Set(edges.flat()));
  return toposort(nodes, edges);
}

export function toposortWithGraph(graph: GraphObject): Node[] {
  const nodes = Array.from(new Set(Object.keys(graph)));
  const actualNodes = new Set<Node>(nodes);
  const edges: EdgesObject = [];
  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i];
    const neighbors = Array.from(new Set(graph[node]));
    for (let j = 0, len = neighbors.length; j < len; j++) {
      edges.push([node, neighbors[j]]);
      actualNodes.add(neighbors[j]);
    }
  }
  return toposort(Array.from(actualNodes), edges);
}

export function toposort(nodes: Node[], edges: EdgesObject): Node[] {
  const refMap = buildRefMap(nodes);
  const outgoingEdges = buildGraphFromEdges(refMap, edges);
  const inDegree: number[] = new Array(nodes.length).fill(0);

  for (let i = 0, len = outgoingEdges.length; i < len; i++) {
    outgoingEdges[i].forEach((neighborIdx) => {
      inDegree[neighborIdx] += 1;
    });
  }

  const queue: number[] = [];

  inDegree.forEach((degree, nodeIdx) => {
    if (degree === 0) {
      queue.push(nodeIdx);
    }
  });

  const topoOrder: string[] = [];

  while (queue.length > 0) {
    const nodeIdx = queue.shift()!;

    topoOrder.push(nodes[nodeIdx]);

    outgoingEdges[nodeIdx].forEach((neighborIdx) => {
      const degree = --inDegree[neighborIdx];
      if (degree === 0) {
        queue.push(neighborIdx);
      }
    });
  }

  if (topoOrder.length !== outgoingEdges.length) {
    throw new Error(`Cyclic dependency detected: ${findCyclicEdge(topoOrder, refMap, outgoingEdges)?.map((idx) => nodes[idx]).join(' -> ')}`);
  }

  return topoOrder;
}

function findCyclicEdge(topoOrder: Node[], refMap: RefMap, graph: Graph): Edge | null {
  const visited = new Set<number>(topoOrder.map((node) => refMap.get(node)!));
  let cyclicEdge: Edge | null = null;

  function dfs(nodeIdx: NodeIdx, predecessors: Set<NodeIdx>): boolean {
    if (predecessors.has(nodeIdx)) {
      return true;
    }
    if (visited.has(nodeIdx)) {
      return false;
    }

    visited.add(nodeIdx);
    predecessors.add(nodeIdx);

    const neighbors = Array.from(graph[nodeIdx]);

    for (let i = 0, len = neighbors.length; i < len; i++) {
      if (dfs(neighbors[i], predecessors)) {
        if (cyclicEdge == null) cyclicEdge = [nodeIdx, neighbors[i]];
        return true;
      }
    }

    predecessors.delete(nodeIdx);
    return false;
  }

  const nodes = Array.from(graph.keys());

  for (let i = 0, len = nodes.length; i < len; i++) {
    if (!visited.has(nodes[i])) {
      if (dfs(nodes[i], new Set<number>())) {
        return cyclicEdge;
      }
    }
  }

  return null;
}