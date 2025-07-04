import { RunMonitor, RunnableLike, RunnableProps } from "./Runnable.types";
import RunnableSequence from "./RunnableSequence";

/**
 * Abstract class representing a runnable task.
 *
 * Runnable tasks run as pure functions that take an input and produce an output.
 * Runnable tasks can be piped together to form a sequence of operations.
 *
 * @template RunInput - The type of input for the run method.
 * @template RunOutput - The type of output from the run method.
 */
export default abstract class Runnable<RunInput, RunOutput> {
  /**
   * The name of the runnable task.
   * @private
   */
  #name?: string;

  protected constructor(props: RunnableProps) {
    this.#name = props.name;
  }

  /**
   * Gets the name of the runnable task.
   * If no name is set, it defaults to the class name.
   *
   * @returns The name of the runnable task.
   */
  get name(): string {
    return this.#name || this.constructor.name;
  }

  set name(n: string) {
    this.#name = n;
  }

  /**
   * The public interface to run the runnable.
   *
   * @param input - The input for the runnable task.
   * @param [monitor] - An optional monitor to track the execution.
   * @returns The output of the runnable task.
   */
  async run(input: RunInput, monitor?: RunMonitor): Promise<RunOutput> {
    let output: RunOutput | undefined;
    let error: Error | undefined;

    try {
      // Record the start of the runnable task execution
      monitor?.recordStart(this, input);
      output = await this.executeTask(input, monitor);
      return output;
    } catch (e) {
      error = e instanceof Error ? e : new Error(String(e));
      throw error;
    } finally {
      // Record the end of the runnable task execution
      monitor?.recordEnd(this, output, error);
    }
  }

  /**
   * Create a new runnable sequence that runs each individual runnable in series,
   * piping the output of one runnable into another runnable or runnable-like.
   *
   * @template NewRunOutput - The type of output for the new runnable.
   * @param runnableLike - A runnable, function, or object whose values are functions or runnables.
   * @returns A new runnable sequence.
   */
  pipe<NewRunOutput>(
    runnableLike: RunnableLike<RunOutput, NewRunOutput>,
  ): RunnableSequence<RunInput, NewRunOutput> {
    return RunnableSequence.from([this]).pipe(runnableLike);
  }

  /**
   * Abstract method to be implemented by subclasses to execute the task.
   * This method should contain the core logic of the runnable task.
   *
   * @param input - The input for the runnable task.
   * @param [monitor] - An optional monitor to track the execution.
   * @returns The output of the runnable task.
   */
  protected abstract executeTask(input: RunInput, monitor?: RunMonitor): Promise<RunOutput>;
}
