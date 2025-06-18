import Runnable from "./Runnable";

export interface RunnerProps<RunInput, RunOutput> {
  runnable: Runnable<RunInput, RunOutput>;
}
