import Runnable from "./Runnable";
import { RunnableFunction } from "./Runnable.types";
import { RunnableLambdaProps } from "./RunnableLambda.types";

export default class RunnableLambda<RunInput, RunOutput, Runner = never> extends Runnable<
  RunInput,
  RunOutput,
  Runner
> {
  fn: RunnableFunction<RunInput, RunOutput, Runner>;

  static from<RunInput, RunOutput, RunConfig = never>(
    fn: RunnableFunction<RunInput, RunOutput, RunConfig>,
    name?: string,
  ): RunnableLambda<RunInput, RunOutput, RunConfig> {
    return new RunnableLambda<RunInput, RunOutput, RunConfig>({
      name: name,
      fn,
    });
  }

  constructor(props: RunnableLambdaProps<RunInput, RunOutput, Runner>) {
    super(props);
    this.fn = props.fn;
  }

  async run(input: RunInput, runner?: Runner): Promise<RunOutput> {
    const output = await this.fn(input, runner);
    return output;
  }
}
