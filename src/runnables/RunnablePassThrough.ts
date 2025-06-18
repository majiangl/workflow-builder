import Runnable from "./Runnable";

export default class RunnablePassThrough<RunInput> extends Runnable<RunInput, RunInput> {
  async run(input: RunInput): Promise<RunInput> {
    return Promise.resolve(input);
  }
}
