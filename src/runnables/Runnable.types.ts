import Runnable from "./Runnable";

export interface RunnableProps {
  name?: string;
}

export type RunnableFunction<RunInput, RunOutput, Runner = never> = (
  input: RunInput,
  runner?: Runner,
) => RunOutput | Promise<RunOutput>;

export type RunnableMap<RunInput, RunOutput, Runner = never> = {
  [K in keyof RunOutput]: RunnableLike<RunInput, RunOutput[K], Runner>;
};

export type RunnableLike<RunInput, RunOutput, Runner = never> =
  | Runnable<RunInput, RunOutput, Runner>
  | RunnableFunction<RunInput, RunOutput, Runner>
  | RunnableMap<RunInput, RunOutput, Runner>;
