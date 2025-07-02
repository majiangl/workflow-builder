import type { RunnableMap, RunnableProps } from "./Runnable.types";

export interface RunnableParallelProps<RunInput, RunOutput> extends RunnableProps {
  steps: RunnableMap<RunInput, RunOutput>;
}
