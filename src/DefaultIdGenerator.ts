import IdGenerator from "./IdGenerator";

export interface DefaultIdGeneratorProps {
  idPrefix?: string;
}

export default class DefaultIdGenerator extends IdGenerator {
  readonly idPrefix: string;
  private currentId: number = 0;

  constructor(props: DefaultIdGeneratorProps = {}) {
    super();
    this.idPrefix = props.idPrefix || "";
  }

  nextId(): string {
    ++this.currentId;
    return `${this.idPrefix}${this.currentId}`;
  }

}
