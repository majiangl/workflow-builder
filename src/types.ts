import {WorkflowNodeType} from "./enums";

export type NodeId = string;

export type ExecutableFunction<Input, Output> = (input: Input) => Promise<Output> | Output;

export type ExecutableLike<Input, Output, NodeType> = NodeType extends WorkflowNodeType.Lambda ?
  ExecutableFunction<Input, Output> : never;
