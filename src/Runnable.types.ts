import Runnable from "./Runnable";

export interface RunnableProps {
  name?: string;
}

export type RunnableFunction<RunInput, RunOutput> = (
  input: RunInput,
) => RunOutput | Promise<RunOutput>;

export type RunnableMap<RunInput, RunOutput> = {
  [K in keyof RunOutput]: RunnableLike<RunInput, RunOutput[K]>;
};

export type RunnableLike<RunInput, RunOutput> =
  | Runnable<RunInput, RunOutput>
  | RunnableFunction<RunInput, RunOutput>
  | RunnableMap<RunInput, RunOutput>;

export interface RunMonitor {
  recordStart: <Input, Output>(runnable: Runnable<Input, Output>, input: Input) => void;
  recordEnd: <Input, Output>(
    runnable: Runnable<Input, Output>,
    output?: Output,
    error?: Error,
  ) => void;
}
