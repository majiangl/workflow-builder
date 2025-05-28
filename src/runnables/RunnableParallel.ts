import { coerceToRunnable } from "./utils";
import Runnable from "./Runnable";
import { RunnableLike, RunnableMap } from "./Runnable.types";
import { RunnableParallelProps } from "./RunnableParallel.types";

export default class RunnableParallel<RunInput, RunOutput, Runner = never> extends Runnable<
  RunInput,
  RunOutput,
  Runner
> {
  protected steps: Record<string, Runnable<RunInput, unknown, Runner>>;

  static from<RunInput, RunOutput, RunConfig = never>(
    steps: RunnableMap<RunInput, RunOutput, RunConfig>,
    name?: string,
  ): RunnableParallel<RunInput, RunOutput, RunConfig> {
    return new RunnableParallel<RunInput, RunOutput, RunConfig>({
      steps,
      name,
    });
  }

  constructor(props: RunnableParallelProps<RunInput, RunOutput, Runner>) {
    super(props);

    this.steps = {};
    for (const [key, value] of Object.entries<RunnableLike<RunInput, unknown, Runner>>(
      props.steps,
    )) {
      this.steps[key] = coerceToRunnable(value);
    }
  }

  async run(input: RunInput, runner?: Runner): Promise<RunOutput> {
    const output: Record<string, unknown> = {};
    await Promise.all(
      Object.entries(this.steps).map(async ([key, value]) => {
        output[key] = await value.run(input, runner);
      }),
    );
    return output as RunOutput;
  }
}
