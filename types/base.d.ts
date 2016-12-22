interface ParameterConfiguration {
  index: number;
  type: any;
  name?: string;
  data?: any;
}

interface Params {
  [key: string]: ParameterConfiguration[];
}
