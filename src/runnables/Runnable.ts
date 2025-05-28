import { RunnableLike, RunnableProps } from "./Runnable.types";
import RunnableSequence from "./RunnableSequence";

export default abstract class Runnable<RunInput, RunOutput, Runner = never> {
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

  abstract run(input: RunInput, runner?: Runner): Promise<RunOutput>;

  pipe<NewRunOutput>(
    runnableLike: RunnableLike<RunOutput, NewRunOutput, Runner>,
  ): RunnableSequence<RunInput, NewRunOutput, Runner> {
    return RunnableSequence.from([this]).pipe(runnableLike);
  }
}
