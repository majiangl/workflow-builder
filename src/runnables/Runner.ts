import { RunnerProps } from "./Runner.types";
import Runnable from "./Runnable";

export default abstract class Runner<RunInput, RunOutput> {
  readonly #runnable: Runnable<RunInput, RunOutput>;

  protected constructor(props: RunnerProps<RunInput, RunOutput>) {
    this.#runnable = props.runnable;
  }

  run(input: RunInput): Promise<RunOutput> {
    return this.#runnable.run(input, this);
  }
}
