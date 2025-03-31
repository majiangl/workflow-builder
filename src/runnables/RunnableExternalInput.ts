import type {RunnableProps} from "./Runnable";
import Runnable from "./Runnable";

export interface RunnableExternalInputProps<CollectorName extends string> extends RunnableProps {
  collector: CollectorName;
}

type DoneCallback<ExternalInput> = (data: ExternalInput) => void;

type CancelCallback = (reason?: never) => void;

export type ExternalInputCollector<RunInput, ExternalInput> = (data: RunInput, done: DoneCallback<ExternalInput>, cancel: CancelCallback) => void;

interface ExternalInputRunConfig<RunInput, ExternalInput, CollectorName extends string> {
  externalInputCollectors: {
    [key in CollectorName]: ExternalInputCollector<RunInput, ExternalInput>
  }
}

export default class RunnableExternalInput<RunInput, RunOutput, RunConfig extends ExternalInputRunConfig<RunInput, RunOutput, CollectorName>, CollectorName extends string> extends Runnable<RunInput, RunOutput, RunConfig> {
  readonly #collector: CollectorName;

  static from<RunInput, RunOutput, RunConfig extends ExternalInputRunConfig<RunInput, RunOutput, CollectorName>, CollectorName extends string>(collector: CollectorName): RunnableExternalInput<RunInput, RunOutput, RunConfig, CollectorName> {
    return new RunnableExternalInput<RunInput, RunOutput, RunConfig, CollectorName>({
      name: collector,
      collector: collector
    });
  }

  constructor(props: RunnableExternalInputProps<CollectorName>) {
    super(props);
    this.#collector = props.collector;
  }

  async run(input: RunInput, config?: RunConfig): Promise<RunOutput> {
    if (!config) {
      throw new Error("The config parameter is required to run external input runnables.");
    }
    const collector = config.externalInputCollectors[this.#collector];
    return await new Promise<RunOutput>((resolve, reject) => {
      collector(input, resolve, reject);
    });
  }
}
