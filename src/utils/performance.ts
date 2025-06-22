// src/utils/performance.ts
import { InteractionManager, Platform } from 'react-native';

export class PerformanceUtils {
  static runAfterInteractions(callback: () => void): void {
    InteractionManager.runAfterInteractions(callback);
  }

  static debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  static throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static getOptimizedFlatListProps() {
    return {
      removeClippedSubviews: true,
      maxToRenderPerBatch: 10,
      updateCellsBatchingPeriod: 100,
      initialNumToRender: 20,
      windowSize: 10,
      getItemLayout: Platform.OS === 'ios' ? undefined : (data: any, index: number) => ({
        length: 80, // Approximate item height
        offset: 80 * index,
        index,
      }),
    };
  }
}