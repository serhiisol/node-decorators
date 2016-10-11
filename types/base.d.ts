interface ParameterConfiguration {
  index: number;
  type: any;
  name?: string;
}

interface Params {
  [key: string]: ParameterConfiguration[];
}
