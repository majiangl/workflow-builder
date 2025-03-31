import type {RunnableProps} from "./Runnable";
import Runnable from "./Runnable";
import type {RunnableLike} from "./RunnableLike";
import {coerceToRunnable} from "./RunnableLike";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RunnableSequenceArray<RunInput, RunOutput, RunConfig = never> =
  [
    RunnableLike<RunInput, RunOutput, RunConfig>
  ] |
  [
    RunnableLike<RunInput, any, RunConfig>,
    ...RunnableLike<any, any, RunConfig>[],
    RunnableLike<any, RunOutput, RunConfig>
  ];

export interface RunnableSequenceProps<RunInput, RunOutput, RunConfig = never> extends RunnableProps {
  steps: RunnableSequenceArray<RunInput, RunOutput, RunConfig>;
}

export default class RunnableSequence<RunInput, RunOutput, RunConfig = never> extends Runnable<RunInput, RunOutput, RunConfig> {
  protected steps: Runnable<any, any, RunConfig>[];

  static from<RunInput, RunOutput, RunConfig = never>(steps: RunnableSequenceArray<RunInput, RunOutput, RunConfig>, name?: string): RunnableSequence<RunInput, RunOutput, RunConfig> {
    return new RunnableSequence<RunInput, RunOutput, RunConfig>({
      steps,
      name
    });
  }

  constructor(props: RunnableSequenceProps<RunInput, RunOutput, RunConfig>) {
    super(props);
    this.steps = props.steps.map((step) => coerceToRunnable(step));
  }

  async run(input: RunInput, config?: RunConfig): Promise<RunOutput> {
    let output: unknown = input;
    for (const step of this.steps) {
      output = await step.run(output, config);
    }
    return output as RunOutput;
  }

  pipe<NewRunOutput>(runnableLike: RunnableLike<RunOutput, NewRunOutput, RunConfig>): RunnableSequence<RunInput, NewRunOutput, RunConfig> {
    const runnable = coerceToRunnable(runnableLike);

    if (runnable instanceof RunnableSequence) {
      return RunnableSequence.from<RunInput, NewRunOutput, RunConfig>([...this.steps, ...runnable.steps] as RunnableSequenceArray<RunInput, NewRunOutput, RunConfig>);
    }

    return RunnableSequence.from<RunInput, NewRunOutput, RunConfig>([...this.steps, runnable] as RunnableSequenceArray<RunInput, NewRunOutput, RunConfig>);
  }
}
