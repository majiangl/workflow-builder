import Runnable from "./Runnable";
import { RunnableFunction } from "./Runnable.types";
import { RunnableLambdaProps } from "./RunnableLambda.types";

/**
 * A Runnable that executes a function.
 *
 * This class is useful for wrapping a function to be used as a Runnable in a workflow.
 *
 * @template RunInput - The type of the input to the function.
 * @template RunOutput - The type of the output from the function.
 */
export default class RunnableLambda<RunInput, RunOutput> extends Runnable<RunInput, RunOutput> {
  /**
   * The function to perform the task.
   * @private
   */
  readonly #fn: RunnableFunction<RunInput, RunOutput>;

  constructor(props: RunnableLambdaProps<RunInput, RunOutput>) {
    super(props);
    this.#fn = props.fn;
  }

  static from<RunInput, RunOutput>(
    fn: RunnableFunction<RunInput, RunOutput>,
    name?: string,
  ): RunnableLambda<RunInput, RunOutput> {
    return new RunnableLambda<RunInput, RunOutput>({
      name: name,
      fn,
    });
  }

  async executeTask(input: RunInput): Promise<RunOutput> {
    return this.#fn(input);
  }
}
