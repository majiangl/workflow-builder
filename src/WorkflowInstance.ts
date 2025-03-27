import Workflow from "./Workflow";

/**
 * Represents an instance of a workflow.
 * A workflow instance is responsible for running the workflow,
 * and managing running data.
 */
export default class WorkflowInstance<Input, Output> {
  private workflow: Workflow<Input, Output>;
  private wasRun: boolean = false;

  /**
   * Creates a new instance of WorkflowInstance.
   * @param workflow - The workflow to be run by this instance.
   */
  constructor(workflow: Workflow<Input, Output>) {
    this.workflow = workflow;
  }

  /**
   * Runs the workflow instance with the given input.
   * @param input - The input to be passed to the workflow.
   * @returns The output of the workflow.
   */
  async run(input: Input): Promise<Output> {
    if (this.wasRun) {
      throw new Error("Workflow instance has already been run.");
    }
    this.wasRun = true;
    // TODO: Implement the logic to run the workflow with the given input.
  }
}
