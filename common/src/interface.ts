export interface CommonMeta {
  parameters: {
    [key: string]: number[];
  };
}

export interface CommonClass extends Object {
  __meta__: CommonMeta;
}
