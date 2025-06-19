import Runnable from "./Runnable";
import Runner from "./Runner";

export interface RunnableProps {
  name?: string;
}

export type RunnableFunction<RunInput, RunOutput> = (
  input: RunInput,
  runner?: Runner<unknown, unknown>,
) => RunOutput | Promise<RunOutput>;

export type RunnableMap<RunInput, RunOutput> = {
  [K in keyof RunOutput]: RunnableLike<RunInput, RunOutput[K]>;
};

export type RunnableLike<RunInput, RunOutput> =
  | Runnable<RunInput, RunOutput>
  | RunnableFunction<RunInput, RunOutput>
  | RunnableMap<RunInput, RunOutput>;
