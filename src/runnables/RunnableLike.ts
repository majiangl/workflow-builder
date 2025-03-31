import RunnableLambda, {type RunnableFunction} from "./RunnableLambda";
import RunnableParallel, {type RunnableMap} from "./RunnableParallel";
import Runnable from "./Runnable";

export type RunnableLike<RunInput, RunOutput, RunConfig = never> =
  Runnable<RunInput, RunOutput, RunConfig>
  | RunnableFunction<RunInput, RunOutput, RunConfig>
  | RunnableMap<RunInput, RunOutput, RunConfig>;

export function coerceToRunnable<RunInput, RunOutput, RunConfig = never>(runnableLike: RunnableLike<RunInput, RunOutput, RunConfig>): Runnable<RunInput, RunOutput, RunConfig> {
  if (runnableLike instanceof Runnable) {
    return runnableLike;
  } else if (typeof runnableLike === "function") {
    return RunnableLambda.from(runnableLike);
  } else {
    return RunnableParallel.from(runnableLike);
  }
}
