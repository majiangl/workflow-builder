import Runnable from "./Runnable";
import { RunnableLike, RunnableProps } from "./Runnable.types";

export type Branch<RunInput, RunOutput, Runner = never> = [
  Runnable<RunInput, boolean, Runner>,
  Runnable<RunInput, RunOutput, Runner>,
];

export type BranchLike<RunInput, RunOutput, Runner = never> = [
  RunnableLike<RunInput, boolean, Runner>,
  RunnableLike<RunInput, RunOutput, Runner>,
];

export interface RunnableBranchProps<RunInput, RunOutput, Runner = never> extends RunnableProps {
  branches: [
    ...BranchLike<RunInput, RunOutput, Runner>[],
    RunnableLike<RunInput, RunOutput, Runner>,
  ];
}
