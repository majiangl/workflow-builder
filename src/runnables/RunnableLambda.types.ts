import { RunnableFunction, RunnableProps } from "./Runnable.types";

export interface RunnableLambdaProps<RunInput, RunOutput, Runner = never> extends RunnableProps {
  fn: RunnableFunction<RunInput, RunOutput, Runner>;
}
