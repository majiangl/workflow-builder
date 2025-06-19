import { RunnableLike, RunnableProps } from "./Runnable.types";
import RunnableSequence from "./RunnableSequence";
import Runner from "./Runner";

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

  abstract run(input: RunInput, runner?: Runner<unknown, unknown>): Promise<RunOutput>;

  pipe<NewRunOutput>(
    runnableLike: RunnableLike<RunOutput, NewRunOutput>,
  ): RunnableSequence<RunInput, NewRunOutput> {
    return RunnableSequence.from([this]).pipe(runnableLike);
  }
}
