import type {RunnableProps} from "./Runnable";
import Runnable from "./Runnable";
import type {RunnableLike} from "./RunnableLike";
import {coerceToRunnable} from "./RunnableLike";

export type Branch<RunInput, RunOutput, RunConfig = never> = [
  Runnable<RunInput, boolean, RunConfig>,
  Runnable<RunInput, RunOutput, RunConfig>
];

export type BranchLike<RunInput, RunOutput, RunConfig = never> = [
  RunnableLike<RunInput, boolean, RunConfig>,
  RunnableLike<RunInput, RunOutput, RunConfig>
];

export interface RunnableBranchProps<RunInput, RunOutput, RunConfig = never> extends RunnableProps {
  branches: [
    ...BranchLike<RunInput, RunOutput, RunConfig>[],
    RunnableLike<RunInput, RunOutput, RunConfig>
  ]
}

export default class RunnableBranch<RunInput, RunOutput, RunConfig = never> extends Runnable<RunInput, RunOutput, RunConfig> {

  readonly #conditionalBranches: Branch<RunInput, RunOutput, RunConfig>[];

  readonly #defaultBranch: Runnable<RunInput, RunOutput, RunConfig>;

  static from<RunInput, RunOutput, RunConfig = never>(branches: RunnableBranchProps<RunInput, RunOutput, RunConfig>["branches"], name?: string): RunnableBranch<RunInput, RunOutput, RunConfig> {
    return new RunnableBranch<RunInput, RunOutput, RunConfig>({
      branches: branches,
      name
    });
  }

  constructor(props: RunnableBranchProps<RunInput, RunOutput, RunConfig>) {
    super(props);

    const {branches} = props;
    this.#conditionalBranches = (branches.slice(0, -1) as BranchLike<RunInput, RunOutput, RunConfig>[]).map(([condition, branch]) => {
      return [coerceToRunnable(condition), coerceToRunnable(branch)];
    });
    this.#defaultBranch = coerceToRunnable(branches[branches.length - 1] as RunnableLike<RunInput, RunOutput, RunConfig>);
  }

  async run(input: RunInput, config?: RunConfig): Promise<RunOutput> {
    for (const [condition, branch] of this.#conditionalBranches) {
      if (await condition.run(input, config)) {
        return await branch.run(input, config);
      }
    }
    return await this.#defaultBranch.run(input, config);
  }

}
