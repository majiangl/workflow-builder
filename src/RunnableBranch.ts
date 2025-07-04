import Runnable from "./Runnable";
import { coerceToRunnable } from "./utils";
import { RunMonitor, RunnableLike } from "./Runnable.types";
import { Branch, BranchLike, RunnableBranchProps } from "./RunnableBranch.types";

/**
 * A Runnable that executes conditional branches.
 *
 * It runs through a list of branches, each with a condition and a runnable task,
 * and a default branch at the end as a fallback.
 *
 * It executes the first branch whose condition evaluates to true,
 * or the default branch if none of the conditions are met.
 *
 * @template RunInput - The type of input for the run method.
 * @template RunOutput - The type of output from the run method.
 */
export default class RunnableBranch<RunInput, RunOutput> extends Runnable<RunInput, RunOutput> {
  /**
   * The conditional branches of the runnable branch.
   * Each branch is a tuple of a condition and a runnable task.
   *
   * @private
   */
  readonly #conditionalBranches: Branch<RunInput, RunOutput>[];

  /**
   * The default branch to run if no conditions are met.
   *
   * @private
   */
  readonly #defaultBranch: Runnable<RunInput, RunOutput>;

  constructor(props: RunnableBranchProps<RunInput, RunOutput>) {
    super(props);

    const { branches } = props;
    this.#conditionalBranches = (branches.slice(0, -1) as BranchLike<RunInput, RunOutput>[]).map(
      ([condition, branch]) => {
        return [coerceToRunnable(condition), coerceToRunnable(branch)];
      },
    );
    this.#defaultBranch = coerceToRunnable(
      branches[branches.length - 1] as RunnableLike<RunInput, RunOutput>,
    );
  }

  static from<RunInput, RunOutput>(
    branches: RunnableBranchProps<RunInput, RunOutput>["branches"],
    name?: string,
  ): RunnableBranch<RunInput, RunOutput> {
    return new RunnableBranch<RunInput, RunOutput>({
      branches: branches,
      name,
    });
  }

  async executeTask(input: RunInput, monitor?: RunMonitor): Promise<RunOutput> {
    for (const [condition, branch] of this.#conditionalBranches) {
      if (await condition.run(input, monitor)) {
        return await branch.run(input, monitor);
      }
    }
    return await this.#defaultBranch.run(input, monitor);
  }
}
