import Runnable from "./Runnable";
import { coerceToRunnable } from "./utils";
import { RunnableLike } from "./Runnable.types";
import { Branch, BranchLike, RunnableBranchProps } from "./RunnableBranch.types";

export default class RunnableBranch<RunInput, RunOutput, Runner = never> extends Runnable<
  RunInput,
  RunOutput,
  Runner
> {
  readonly #conditionalBranches: Branch<RunInput, RunOutput, Runner>[];

  readonly #defaultBranch: Runnable<RunInput, RunOutput, Runner>;

  static from<RunInput, RunOutput, RunConfig = never>(
    branches: RunnableBranchProps<RunInput, RunOutput, RunConfig>["branches"],
    name?: string,
  ): RunnableBranch<RunInput, RunOutput, RunConfig> {
    return new RunnableBranch<RunInput, RunOutput, RunConfig>({
      branches: branches,
      name,
    });
  }

  constructor(props: RunnableBranchProps<RunInput, RunOutput, Runner>) {
    super(props);

    const { branches } = props;
    this.#conditionalBranches = (
      branches.slice(0, -1) as BranchLike<RunInput, RunOutput, Runner>[]
    ).map(([condition, branch]) => {
      return [coerceToRunnable(condition), coerceToRunnable(branch)];
    });
    this.#defaultBranch = coerceToRunnable(
      branches[branches.length - 1] as RunnableLike<RunInput, RunOutput, Runner>,
    );
  }

  async run(input: RunInput, runner?: Runner): Promise<RunOutput> {
    for (const [condition, branch] of this.#conditionalBranches) {
      if (await condition.run(input, runner)) {
        return await branch.run(input, runner);
      }
    }
    return await this.#defaultBranch.run(input, runner);
  }
}
