interface CommonMeta {
  parameters: {
    [key: string]: number[];
  };
}

interface CommonClass extends Object {
  __meta__: CommonMeta;
}