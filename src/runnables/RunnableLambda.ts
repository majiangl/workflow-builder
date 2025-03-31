import type {RunnableProps} from "./Runnable";
import Runnable from "./Runnable";

export type RunnableFunction<RunInput, RunOutput, RunConfig = never> = (input: RunInput, config?: RunConfig) => RunOutput | Promise<RunOutput>;

export interface RunnableLambdaProps<RunInput, RunOutput, RunConfig = never> extends RunnableProps {
  fn: RunnableFunction<RunInput, RunOutput, RunConfig>
}

export default class RunnableLambda<RunInput, RunOutput, RunConfig = never> extends Runnable<RunInput, RunOutput, RunConfig> {
  fn: RunnableFunction<RunInput, RunOutput, RunConfig>;

  static from<RunInput, RunOutput, RunConfig = never>(fn: RunnableFunction<RunInput, RunOutput, RunConfig>, name?: string): RunnableLambda<RunInput, RunOutput, RunConfig> {
    return new RunnableLambda<RunInput, RunOutput, RunConfig>({
      name: name || fn.name,
      fn
    });
  }

  constructor(props: RunnableLambdaProps<RunInput, RunOutput, RunConfig>) {
    super(props);
    this.fn = props.fn;
  }

  async run(input: RunInput, config?: RunConfig): Promise<RunOutput> {
    const output = await this.fn(input, config);
    return output;
  }
}
