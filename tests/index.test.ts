import { toposortWithEdges, toposortWithGraph, toposort, EdgeObject } from '../src/index';

describe('toposort', () => {
  describe('toposort', () => {
    test('should return topo sorted result', () => {
      const nodes = ['a', 'b', 'c', 'd', 'e', 'f'];
      const edges: EdgeObject[] = [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'd'],
        ['d', 'e'],
        ['e', 'f'],
      ];
      const result = toposort(nodes, edges);
      expect(result).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    });

    test('should throw error due to cyclic dependency', () => {
      const nodes = ['a', 'b', 'c', 'd', 'e', 'f'];
      const edges: EdgeObject[] = [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'd'],
        ['d', 'e'],
        ['e', 'f'],
        ['f', 'a'],
      ];
      expect(() => toposort(nodes, edges)).toThrow('Cyclic dependency detected: f -> a');
    });
  });

  describe('toposortWithGraph', () => {
    test('should return topo sorted result', () => {
      const graph = {
        a: ['b', 'c'],
        b: ['d'],
        c: ['d'],
        d: ['e'],
        e: ['f']
      };
      const result = toposortWithGraph(graph);
      expect(result).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    });

    test('should throw error due to cyclic dependency', () => {
      const graph = {
        a: ['b', 'c'],
        b: ['d'],
        c: ['d'],
        d: ['e'],
        e: ['f'],
        f: ['a'],
      };
      expect(() => toposortWithGraph(graph)).toThrow('Cyclic dependency detected: f -> a');
    });
  });

  describe('toposortWithEdges', () => {
    test('should return topo sorted result', () => {
      const edges: EdgeObject[] = [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'd'],
        ['d', 'e'],
        ['e', 'f'],
      ];
      const result = toposortWithEdges(edges);
      expect(result).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    });

    test('should throw error due to cyclic dependency', () => {
      const edges: EdgeObject[] = [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'd'],
        ['d', 'e'],
        ['e', 'f'],
        ['f', 'a'],
      ];
      expect(() => toposortWithEdges(edges)).toThrow('Cyclic dependency detected: f -> a');
    });
  });
})