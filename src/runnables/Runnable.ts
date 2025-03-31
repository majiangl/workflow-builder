import type {RunnableLike} from "./RunnableLike";
import RunnableSequence from "./RunnableSequence";

export interface RunnableProps {
  name?: string;
}

export default abstract class Runnable<RunInput, RunOutput, RunConfig = never> {
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

  abstract run(input: RunInput, config?: RunConfig): Promise<RunOutput>;

  pipe<NewRunOutput>(runnableLike: RunnableLike<RunOutput, NewRunOutput, RunConfig>): RunnableSequence<RunInput, NewRunOutput, RunConfig> {
    return RunnableSequence.from([this]).pipe(runnableLike);
  }
}
