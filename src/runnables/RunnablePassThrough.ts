import Runnable from "./Runnable";

export default class RunnablePassThrough<RunInput, RunConfig = never> extends Runnable<RunInput, RunInput, RunConfig> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(input: RunInput, config?: RunConfig): Promise<RunInput> {
    return Promise.resolve(input);
  }

}
