import { RunMonitor, RunnableLike, RunnableProps } from "./Runnable.types";
import RunnableSequence from "./RunnableSequence";

export default abstract class Runnable<RunInput, RunOutput> {
  #name?: string;

  protected constructor(props: RunnableProps) {
    this.#name = props.name;
  }

  get name() {
    return this.#name || this.constructor.name;
  }

  set name(n: string) {
    this.#name = n;
  }

  async run(input: RunInput, monitor?: RunMonitor): Promise<RunOutput> {
    let output: RunOutput | undefined;
    let error: Error | undefined;

    try {
      monitor?.recordStart(this, input);
      output = await this.executeTask(input, monitor);
      return output;
    } catch (e) {
      error = e instanceof Error ? e : new Error(String(e));
      throw error;
    } finally {
      monitor?.recordEnd(this, output, error);
    }
  }

  protected abstract executeTask(input: RunInput, monitor?: RunMonitor): Promise<RunOutput>;

  pipe<NewRunOutput>(
    runnableLike: RunnableLike<RunOutput, NewRunOutput>,
  ): RunnableSequence<RunInput, NewRunOutput> {
    return RunnableSequence.from([this]).pipe(runnableLike);
  }
}
