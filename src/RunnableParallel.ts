import { coerceToRunnable } from "./utils";
import Runnable from "./Runnable";
import { RunMonitor, RunnableLike, RunnableMap } from "./Runnable.types";
import { RunnableParallelProps } from "./RunnableParallel.types";

/**
 * A Runnable that executes multiple runnables in parallel for the given input.
 * It is useful for running multiple tasks concurrently and collecting their results.
 *
 * @template RunInput - The input type for the runnables.
 * @template RunOutput - The output type for the runnables.
 */
export default class RunnableParallel<RunInput, RunOutput> extends Runnable<RunInput, RunOutput> {
  /**
   * A map of step names to runnables.
   * @private
   */
  readonly #steps: Record<string, Runnable<RunInput, unknown>>;

  constructor(props: RunnableParallelProps<RunInput, RunOutput>) {
    super(props);

    this.#steps = {};
    for (const [key, value] of Object.entries<RunnableLike<RunInput, unknown>>(props.steps)) {
      this.#steps[key] = coerceToRunnable(value);
    }
  }

  static from<RunInput, RunOutput>(
    steps: RunnableMap<RunInput, RunOutput>,
    name?: string,
  ): RunnableParallel<RunInput, RunOutput> {
    return new RunnableParallel<RunInput, RunOutput>({
      steps,
      name,
    });
  }

  async executeTask(input: RunInput, monitor?: RunMonitor): Promise<RunOutput> {
    const output: Record<string, unknown> = {};
    await Promise.all(
      Object.entries(this.#steps).map(async ([key, value]) => {
        output[key] = await value.run(input, monitor);
      }),
    );
    return output as RunOutput;
  }
}
