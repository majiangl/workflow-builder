import { RunMetrics, RunnerProps } from "./Runner.types";
import Runnable from "./Runnable";
import { RunMonitor } from "./Runnable.types";

export default class Runner<RunInput, RunOutput> {
  monitor: boolean;
  #runnable: Runnable<RunInput, RunOutput>;
  #running: boolean = false;
  #runMetricsMap: Map<Runnable<unknown, unknown>, RunMetrics<unknown, unknown>>;

  constructor({ runnable, monitor = false }: RunnerProps<RunInput, RunOutput>) {
    this.#runnable = runnable;
    this.monitor = monitor;
    this.#runMetricsMap = new Map();
  }

  async run(input: RunInput): Promise<RunOutput> {
    if (this.#running) {
      throw new Error("Runner is already running");
    }
    try {
      this.#running = true;
      this.#runMetricsMap.clear();
      return await this.#runnable.run(input, this.getRunMonitor());
    } finally {
      this.#running = false;
    }
  }

  isRunning(): boolean {
    return this.#running;
  }

  private getRunMonitor(): RunMonitor | undefined {
    if (!this.monitor) {
      return undefined;
    }
    return {
      recordStart: this.recordStart.bind(this),
      recordEnd: this.recordEnd.bind(this),
    };
  }

  private recordStart<Input, Output>(runnable: Runnable<Input, Output>, input: Input): void {
    let metrics = this.#runMetricsMap.get(runnable);
    if (!metrics) {
      metrics = { calls: [] };
      this.#runMetricsMap.set(runnable, metrics);
    }
    metrics.calls.push({ startTime: Date.now(), input });
  }

  private recordEnd<Input, Output>(
    runnable: Runnable<Input, Output>,
    output?: Output,
    error?: Error,
  ): void {
    const metrics = this.#runMetricsMap.get(runnable);
    if (metrics) {
      const lastCall = metrics.calls[metrics.calls.length - 1];
      if (lastCall) {
        lastCall.endTime = Date.now();
        lastCall.output = output;
        lastCall.error = error;
      }
    }
  }
}
