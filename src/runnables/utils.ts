import RunnableLambda from "./RunnableLambda";
import RunnableParallel from "./RunnableParallel";
import Runnable from "./Runnable";
import { RunnableLike } from "./Runnable.types";

export function coerceToRunnable<RunInput, RunOutput>(
  runnableLike: RunnableLike<RunInput, RunOutput>,
): Runnable<RunInput, RunOutput> {
  if (runnableLike instanceof Runnable) {
    return runnableLike;
  } else if (typeof runnableLike === "function") {
    return RunnableLambda.from(runnableLike);
  } else {
    return RunnableParallel.from(runnableLike);
  }
}
