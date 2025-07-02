import Runnable from "./Runnable";

export interface RunnerProps<RunInput, RunOutput> {
  runnable: Runnable<RunInput, RunOutput>;
  monitor?: boolean;
}

export interface RunMetrics<Input, Output> {
  calls: Array<{
    startTime: number;
    endTime?: number;
    input: Input;
    output?: Output;
    error?: Error;
  }>;
}
