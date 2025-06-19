import Runnable from "./Runnable";
import { RunnableFunction } from "./Runnable.types";
import { RunnableLambdaProps } from "./RunnableLambda.types";
import Runner from "./Runner";

export default class RunnableLambda<RunInput, RunOutput> extends Runnable<RunInput, RunOutput> {
  fn: RunnableFunction<RunInput, RunOutput>;

  static from<RunInput, RunOutput>(
    fn: RunnableFunction<RunInput, RunOutput>,
    name?: string,
  ): RunnableLambda<RunInput, RunOutput> {
    return new RunnableLambda<RunInput, RunOutput>({
      name: name,
      fn,
    });
  }

  constructor(props: RunnableLambdaProps<RunInput, RunOutput>) {
    super(props);
    this.fn = props.fn;
  }

  async run(input: RunInput, runner?: Runner<unknown, unknown>): Promise<RunOutput> {
    return this.fn(input, runner);
  }
}
