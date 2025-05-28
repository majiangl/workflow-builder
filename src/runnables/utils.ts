import RunnableLambda from "./RunnableLambda";
import RunnableParallel from "./RunnableParallel";
import Runnable from "./Runnable";
import { RunnableLike } from "./Runnable.types";

export function coerceToRunnable<RunInput, RunOutput, Runner = never>(
  runnableLike: RunnableLike<RunInput, RunOutput, Runner>,
): Runnable<RunInput, RunOutput, Runner> {
  if (runnableLike instanceof Runnable) {
    return runnableLike;
  } else if (typeof runnableLike === "function") {
    return RunnableLambda.from(runnableLike);
  } else {
    return RunnableParallel.from(runnableLike);
  }
}
