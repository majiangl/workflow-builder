import type { RunnableMap, RunnableProps } from "./Runnable.types";

export interface RunnableParallelProps<RunInput, RunOutput, Runner = never> extends RunnableProps {
  steps: RunnableMap<RunInput, RunOutput, Runner>;
}
