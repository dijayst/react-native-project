
// src/utils/__tests__/performance.test.ts

import { PerformanceUtils } from "../../../utils/performance";

describe('PerformanceUtils', () => {
  describe('debounce', () => {
    it('should debounce function calls', (done) => {
      let callCount = 0;
      const debouncedFn = PerformanceUtils.debounce(() => {
        callCount++;
      }, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(callCount).toBe(0);

      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });

    it('should pass arguments correctly', (done) => {
      let receivedArgs: any[] = [];
      const debouncedFn = PerformanceUtils.debounce((...args: any[]) => {
        receivedArgs = args;
      }, 50);

      debouncedFn('test', 123, { key: 'value' });

      setTimeout(() => {
        expect(receivedArgs).toEqual(['test', 123, { key: 'value' }]);
        done();
      }, 100);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', (done) => {
      let callCount = 0;
      const throttledFn = PerformanceUtils.throttle(() => {
        callCount++;
      }, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(callCount).toBe(1);

      setTimeout(() => {
        throttledFn();
        expect(callCount).toBe(2);
        done();
      }, 150);
    });
  });

  describe('getOptimizedFlatListProps', () => {
    it('should return optimized FlatList props', () => {
      const props = PerformanceUtils.getOptimizedFlatListProps();
      
      expect(props.removeClippedSubviews).toBe(true);
      expect(props.maxToRenderPerBatch).toBe(10);
      expect(props.updateCellsBatchingPeriod).toBe(100);
      expect(props.initialNumToRender).toBe(20);
      expect(props.windowSize).toBe(10);
    });
  });
});