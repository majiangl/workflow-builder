import Runnable from "./Runnable";

export default class RunnablePassThrough<RunInput> extends Runnable<RunInput, RunInput> {
  async executeTask(input: RunInput): Promise<RunInput> {
    return Promise.resolve(input);
  }
}
