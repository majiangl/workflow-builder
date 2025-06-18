import Runnable from "./Runnable";
import { coerceToRunnable } from "./utils";
import { RunnableLike } from "./Runnable.types";
import { Branch, BranchLike, RunnableBranchProps } from "./RunnableBranch.types";
import Runner from "./Runner";

export default class RunnableBranch<RunInput, RunOutput> extends Runnable<RunInput, RunOutput> {
  readonly #conditionalBranches: Branch<RunInput, RunOutput>[];

  readonly #defaultBranch: Runnable<RunInput, RunOutput>;

  static from<RunInput, RunOutput>(
    branches: RunnableBranchProps<RunInput, RunOutput>["branches"],
    name?: string,
  ): RunnableBranch<RunInput, RunOutput> {
    return new RunnableBranch<RunInput, RunOutput>({
      branches: branches,
      name,
    });
  }

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

  async run(input: RunInput, runner?: Runner): Promise<RunOutput> {
    for (const [condition, branch] of this.#conditionalBranches) {
      if (await condition.run(input, runner)) {
        return await branch.run(input, runner);
      }
    }
    return await this.#defaultBranch.run(input, runner);
  }
}
