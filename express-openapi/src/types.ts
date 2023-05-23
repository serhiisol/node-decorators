type Type = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';

type Ref = {
  $ref: string;
};
type OneOf = {
  oneOf: Array<Type | Ref>;
};
type AnyOf = {
  anyOf: Array<Type | Ref>;
};
type AllOf = {
  allOf: Array<Type | Ref>;
};
type Not = {
  not: Type | Ref;
}

type CommonAttrs<T> = {
  default?: T;
  example?: T;
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
}

type StringAttrs = {
  minLength?: number;
  maxLength?: number;
  format?: string;
  pattern?: string;
  enum?: string[];
} & CommonAttrs<string>;
type NumericAttrs = {
  minimum?: number;
  maximum?: number;
  format?: string;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
} & CommonAttrs<number>;
type ArrayAttrs = {
  items: SchemaDef;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
} & CommonAttrs<any[]>
type ObjectAttrs = {
  properties?: Properties;
  required?: string[];
} & CommonAttrs<object>;
export type StringSchemaDef = { type: 'string' } & StringAttrs;
export type NumericSchemaDef = { type: 'number' | 'integer' } & NumericAttrs;
export type BooleanSchemaDef = { type: 'boolean' } & CommonAttrs<boolean>;
export type ArraySchemaDef = { type: 'array' } & ArrayAttrs;
export type ObjectSchemaDef = { type: 'object' } & ObjectAttrs;
export type SchemaDef = Ref | OneOf | AnyOf | AllOf | Not |
  StringSchemaDef | NumericSchemaDef | BooleanSchemaDef | ArraySchemaDef | ObjectSchemaDef;
export type Properties = {
  [key: string]: SchemaDef;
}

export type StandardHttpSecurityScheme = {
  type: "http";
  scheme: "basic" | "digest" | "hoba" | "mutual" | "negotiate" | "oauth" | "scram-sha-1" | "scram-sha-256" | "vapid";
}

export type BearerHttpSecurityScheme = {
  type: "http";
  scheme: "bearer";
  bearerFormat?: "JWT" | Omit<string, "JWT">;
}

export type HttpSecurityScheme = StandardHttpSecurityScheme | BearerHttpSecurityScheme;

export type ApiKeySecurityScheme = {
  type: "apiKey";
  in: "header" | "query" | "cookie";
  name: string;
}

export type OpenIdConnectSecurityScheme = {
  type: "openIdConnect";
  openIdConnectUrl: string;
}

export type OAuth2SecuritySchemeFlowBase = {
  refreshUrl?: string;
  scopes: { [scope: string]: string };
}

export type OAuth2SecurityScheme = {
  type: "oauth2";
  flows: {
    authorizationCode?: OAuth2SecuritySchemeFlowBase & {
      authorizationUrl: string;
      tokenUrl: string;
    };
    implicit?: OAuth2SecuritySchemeFlowBase & {
      authorizationUrl: string;
    };
    password?: OAuth2SecuritySchemeFlowBase & {
      tokenUrl: string;
    };
    clientCredentials?: OAuth2SecuritySchemeFlowBase & {
      tokenUrl: string;
    }
  };
}

export type SecurityScheme = HttpSecurityScheme | ApiKeySecurityScheme | OpenIdConnectSecurityScheme | OAuth2SecurityScheme;

export type OpenApiOptions = {
  serveOnPath?: string;
  info?: {
    title?: string;
    description?: string;
    version?: string;
  };
  tags?: { name: string, description?: string }[];
  servers?: { url: string, description?: string }[];
  externalDocs?: { url: string, description?: string; };
  security?: PathSecurity;
  components?: {
    securitySchemes?: { [schemeName: string]: SecurityScheme };
  };
}

export type ParamLocation = 'query' | 'header' | 'path' | 'cookie';

export type ParamOptions = {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  contentMediaType?: string;
};

export type ParamDef = {
  name: string;
  in: ParamLocation;
} & ParamOptions;

export type Content = {
  [mediaType: string]: { schema: SchemaDef }
};

export type RequestBody = {
  description?: string;
  required?: boolean;
  content: Content;
}

export type ResponseDescriptor = {
  description: string;
  content: Content;
}

export type PathResponses = { [httpStatus: string]: ResponseDescriptor }

export type PathMeta = {
  summary?: string;
  description?: string;
  parameters?: ParamDef[];
  tags?: string[];
  deprecated?: true | string[],
  requestBody?: RequestBody;
  responses?: PathResponses;
  security?: PathSecurity;
}

export type PathSecurity = Array<{ [schemeName: string]: string[] }>

export type OpenApiMeta = {
  [methodName: string]: PathMeta;
}

export type SchemaMeta = {
  properties?: Properties;
  required?: string[];
}

export interface OpenApiClass {
  __openapi_meta__?: OpenApiMeta;
  __openapi_schema_meta__?: SchemaMeta;
}
