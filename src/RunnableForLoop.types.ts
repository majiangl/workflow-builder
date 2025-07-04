import { RunnableLike, RunnableProps } from "./Runnable.types";

export interface RunnableForLoopProps<RunInput, RunOutput extends [], IterateInput extends boolean>
  extends RunnableProps {
  iteratee: RunnableLike<IterateeInput<RunInput, IterateInput>, IterateeOutput<RunOutput>>;
  iterations: Iterations<RunInput, IterateInput>;
}

export type IterateeInput<RunInput, IterateInput extends boolean> = IterateInput extends true
  ? RunInput extends Array<infer T>
    ? T
    : never
  : RunInput;

export type IterateeOutput<RunOutput> = RunOutput extends Array<infer T> ? T : never;

export type Iterations<RunInput, IterateInput extends boolean> = IterateInput extends true
  ? undefined
  : number | ((input: RunInput) => number);
