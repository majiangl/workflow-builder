import { RunnableLike, RunnableProps } from "./Runnable.types";

export type RunnableSequenceArray<RunInput, RunOutput> =
  | [RunnableLike<RunInput, RunOutput>]
  | [
      RunnableLike<RunInput, unknown>,
      ...RunnableLike<unknown, unknown>[],
      RunnableLike<unknown, RunOutput>,
    ];

export interface RunnableSequenceProps<RunInput, RunOutput> extends RunnableProps {
  steps: RunnableSequenceArray<RunInput, RunOutput>;
}
