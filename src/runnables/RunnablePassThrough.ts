import Runnable from "./Runnable";

export default class RunnablePassThrough<RunInput, Runner = never> extends Runnable<
  RunInput,
  RunInput,
  Runner
> {
  async run(input: RunInput): Promise<RunInput> {
    return Promise.resolve(input);
  }
}
