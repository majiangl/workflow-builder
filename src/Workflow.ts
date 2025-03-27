import WorkflowInstance from "./WorkflowInstance";
import WorkflowNode from "./WorkflowNode";
import IdGenerator from "./IdGenerator";
import DefaultIdGenerator from "./DefaultIdGenerator";
import {Executable, ExecutableFunction, NodeId} from "./types";
import {WorkflowNodeType} from "./enums";

export interface WorkflowProps {
  idGenerator?: IdGenerator;
}

/**
 * Represents a workflow.
 * A workflow is a sequence of steps that can be executed.
 */
export default class Workflow<Input, Output> {
  private idIndex: Map<NodeId, WorkflowNode<any, any, WorkflowNodeType>>;
  private idGenerator: IdGenerator;
  private start: NodeId | undefined;
  private ends: NodeId[];

  constructor(props: WorkflowProps) {
    this.idIndex = new Map();
    this.idGenerator = props.idGenerator || new DefaultIdGenerator();
    this.ends = [];
  }

  createNode<T extends WorkflowNodeType>(name: string, type: T, execute: Executable<Input, Output, T>): WorkflowNode<Input, Output, T> {
    const id = this.idGenerator.nextId();
    const node = new WorkflowNode({
      id,
      name,
      type,
      execute: execute,
    }, this);
    this.idIndex.set(id, node);
    return node;
  }

  createLambdaNode(name: string, execute: ExecutableFunction<Input, Output>): WorkflowNode<Input, Output, WorkflowNodeType.Lambda> {
    return this.createNode(name, WorkflowNodeType.Lambda, execute);
  }

  /**
   * Creates a new instance of the workflow.
   */
  createInstance(): WorkflowInstance<Input, Output> {
    return new WorkflowInstance(this);
  }

  getNode(id: NodeId): WorkflowNode<any, any, WorkflowNodeType> | undefined {
    return this.idIndex.get(id);
  }

  startFrom<T extends WorkflowNodeType>(node: WorkflowNode<Input, any, T>): WorkflowNode<Input, any, T> {
    if (this.start) {
      throw new Error("The workflow already has a start node");
    }
    this.start = node.id;
    return node;
  }

  endTo(node: WorkflowNode<any, Output, WorkflowNodeType>): void {
    if (!this.ends.includes(node.id)) {
      this.ends.push(node.id);
    }
  }

  startsWith(node: WorkflowNode<Input, any, WorkflowNodeType>): boolean {
    if (!this.start) return false;
    return this.getNode(this.start) === node;
  }

  endsWith(node: WorkflowNode<any, Output, WorkflowNodeType>): boolean {
    if (this.ends.includes(node.id)) {
      return this.getNode(node.id) === node;
    }
    return false;
  }

  assertValid(): void {
   this.assertHasStartNode();
   this.assertHasEndNode();
  }

  private assertHasStartNode(): void {
    if (!this.start) {
      throw new Error("The workflow does not have a start node");
    }
  }

  private assertHasEndNode(): void {
    if (this.ends.length === 0) {
      throw new Error("The workflow does not have an end node");
    }
  }
}
