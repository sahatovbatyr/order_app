export interface ILogMeta {
  readonly context?: string;
  correlationId?: string;
  [key: string]: any;
}
