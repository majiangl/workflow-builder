import Runnable from "./Runnable";
import { RunnableLike, RunnableProps } from "./Runnable.types";

export type Branch<RunInput, RunOutput> = [
  Runnable<RunInput, boolean>,
  Runnable<RunInput, RunOutput>,
];

export type BranchLike<RunInput, RunOutput> = [
  RunnableLike<RunInput, boolean>,
  RunnableLike<RunInput, RunOutput>,
];

export interface RunnableBranchProps<RunInput, RunOutput> extends RunnableProps {
  branches: [...BranchLike<RunInput, RunOutput>[], RunnableLike<RunInput, RunOutput>];
}
