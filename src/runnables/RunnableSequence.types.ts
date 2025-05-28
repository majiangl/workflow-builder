import { RunnableLike, RunnableProps } from "./Runnable.types";

export type RunnableSequenceArray<RunInput, RunOutput, RunConfig = never> =
  | [RunnableLike<RunInput, RunOutput, RunConfig>]
  | [
      RunnableLike<RunInput, unknown, RunConfig>,
      ...RunnableLike<unknown, unknown, RunConfig>[],
      RunnableLike<unknown, RunOutput, RunConfig>,
    ];

export interface RunnableSequenceProps<RunInput, RunOutput, RunConfig = never>
  extends RunnableProps {
  steps: RunnableSequenceArray<RunInput, RunOutput, RunConfig>;
}
