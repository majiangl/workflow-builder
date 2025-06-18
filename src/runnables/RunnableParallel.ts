import { coerceToRunnable } from "./utils";
import Runnable from "./Runnable";
import { RunnableLike, RunnableMap } from "./Runnable.types";
import { RunnableParallelProps } from "./RunnableParallel.types";
import Runner from "./Runner";

export default class RunnableParallel<RunInput, RunOutput> extends Runnable<RunInput, RunOutput> {
  protected steps: Record<string, Runnable<RunInput, unknown>>;

  static from<RunInput, RunOutput>(
    steps: RunnableMap<RunInput, RunOutput>,
    name?: string,
  ): RunnableParallel<RunInput, RunOutput> {
    return new RunnableParallel<RunInput, RunOutput>({
      steps,
      name,
    });
  }

  constructor(props: RunnableParallelProps<RunInput, RunOutput>) {
    super(props);

    this.steps = {};
    for (const [key, value] of Object.entries<RunnableLike<RunInput, unknown>>(props.steps)) {
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
