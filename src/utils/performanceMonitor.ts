// src/utils/performanceMonitor.ts
export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();
  
  static startTimer(label: string): void {
    this.metrics.set(label, Date.now());
  }
  
  static endTimer(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) return 0;
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ ${label}: ${duration}ms`);
    this.metrics.delete(label);
    return duration;
  }
  
  static measureRenderTime<T>(component: string, fn: () => T): T {
    this.startTimer(`render_${component}`);
    const result = fn();
    this.endTimer(`render_${component}`);
    return result;
  }
}