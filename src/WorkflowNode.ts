import Workflow from "./Workflow";
import {WorkflowNodeType} from "./enums";
import {ExecutableLike} from "./types";

export interface WorkflowNodeProps<Input, Output, NodeType extends WorkflowNodeType> {
  id: string;
  name: string;
  type: NodeType;
  execute: ExecutableLike<Input, Output, NodeType>;
}

export default class WorkflowNode<Input, Output, NodeType extends WorkflowNodeType> {
  readonly id: string;
  readonly name: string;
  readonly type: NodeType;
  readonly execute: ExecutableLike<Input, Output, NodeType>;

  private workflow: Workflow<any, any>;
  private next: string | ((input: Output) => void) | undefined;

  constructor(props: WorkflowNodeProps<Input, Output, NodeType>, workflow: Workflow<any, any>) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.execute = props.execute;
    this.workflow = workflow;
  }

  assertUnchained() {
    if (this.next !== undefined) {
      throw new Error("This node is already chained to another node");
    }
  }

  chain<NextOutput>(node: WorkflowNode<Output, NextOutput, NodeType>): WorkflowNode<Output, NextOutput, NodeType> {
    this.assertUnchained();
    this.next = node.id;
    return node;
  }

  end(): void {
    this.assertUnchained();
    this.workflow.endTo(this);
  }

  getNextNode(): WorkflowNode<Output, any, WorkflowNodeType> | undefined {
    return typeof this.next === 'string' ? this.workflow.getNode(this.next) : undefined;
  }

}
