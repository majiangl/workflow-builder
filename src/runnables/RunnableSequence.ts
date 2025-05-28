import Runnable from "./Runnable";
import { coerceToRunnable } from "./utils";
import { RunnableLike } from "./Runnable.types";
import { RunnableSequenceArray, RunnableSequenceProps } from "./RunnableSequence.types";

export default class RunnableSequence<RunInput, RunOutput, Runner = never> extends Runnable<
  RunInput,
  RunOutput,
  Runner
> {
  protected steps: Runnable<unknown, unknown, Runner>[];

  static from<RunInput, RunOutput, RunConfig = never>(
    steps: RunnableSequenceArray<RunInput, RunOutput, RunConfig>,
    name?: string,
  ): RunnableSequence<RunInput, RunOutput, RunConfig> {
    return new RunnableSequence<RunInput, RunOutput, RunConfig>({
      steps,
      name,
    });
  }

  constructor(props: RunnableSequenceProps<RunInput, RunOutput, Runner>) {
    super(props);
    this.steps = props.steps.map((step) => coerceToRunnable(step));
  }

  async run(input: RunInput, runner?: Runner): Promise<RunOutput> {
    let output: unknown = input;
    for (const step of this.steps) {
      output = await step.run(output, runner);
    }
    return output as RunOutput;
  }

  pipe<NewRunOutput>(
    runnableLike: RunnableLike<RunOutput, NewRunOutput, Runner>,
  ): RunnableSequence<RunInput, NewRunOutput, Runner> {
    const runnable = coerceToRunnable(runnableLike);

    if (runnable instanceof RunnableSequence) {
      return RunnableSequence.from<RunInput, NewRunOutput, Runner>([
        ...this.steps,
        ...runnable.steps,
      ] as RunnableSequenceArray<RunInput, NewRunOutput, Runner>);
    }

    return RunnableSequence.from<RunInput, NewRunOutput, Runner>([
      ...this.steps,
      runnable,
    ] as RunnableSequenceArray<RunInput, NewRunOutput, Runner>);
  }
}
