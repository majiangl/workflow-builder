import { RunnableFunction, RunnableProps } from "./Runnable.types";

export interface RunnableLambdaProps<RunInput, RunOutput> extends RunnableProps {
  fn: RunnableFunction<RunInput, RunOutput>;
}
