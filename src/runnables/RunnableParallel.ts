import type { RunnableLike} from "./RunnableLike";
import {coerceToRunnable} from "./RunnableLike";
import type {RunnableProps} from "./Runnable";
import Runnable from "./Runnable";

export type RunnableMap<RunInput, RunOutput, RunConfig = never> = {
  [K in keyof RunOutput]: RunnableLike<RunInput, RunOutput[K], RunConfig>;
};

export interface RunnableParallelProps<RunInput, RunOutput, RunConfig = never> extends RunnableProps {
  steps: RunnableMap<RunInput, RunOutput, RunConfig>
}

export default class RunnableParallel<RunInput, RunOutput, RunConfig = never> extends Runnable<RunInput, RunOutput, RunConfig> {
  protected steps: Record<string, Runnable<RunInput, unknown, RunConfig>>;

  static from<RunInput, RunOutput, RunConfig = never>(steps: RunnableMap<RunInput, RunOutput, RunConfig>, name?: string): RunnableParallel<RunInput, RunOutput, RunConfig> {
    return new RunnableParallel<RunInput, RunOutput, RunConfig>({
      steps,
      name
    });
  }

  constructor(props: RunnableParallelProps<RunInput, RunOutput, RunConfig>) {
    super(props);

    this.steps = {};
    for (const [key, value] of Object.entries(props.steps)) {
      this.steps[key] = coerceToRunnable(value as RunnableLike<RunInput, unknown, RunConfig>);
    }
  }

  async run(input: RunInput, config?: RunConfig): Promise<RunOutput> {
    const output: Record<string, unknown> = {};
    await Promise.all(Object.entries(this.steps).map(async ([key, value]) => {
      output[key] = await value.run(input, config);
    }));
    return output as RunOutput;
  }
}
