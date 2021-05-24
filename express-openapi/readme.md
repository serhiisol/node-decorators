# Node decorators - express-openapi

`openapi` decorators and swagger-ui implementation extending `@decorators/express`

### Installation
```
npm install @decorators/express-openapi
```

### API

### Functions

```ts
enableOpenApi(app: express.Application, options: OpenApiOptions = {}): void
```

Initiates the openapi document and attaches it to the application.

**Params:**:

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| app | `express.Application` | | The application object |
| options | `object` | <ul><li>optional</li><li>Default: `{}`</li></ul> | Options to configure swagger ui and the openapi document itself |
| options.serveInPath | `string` | <ul><li>optional</li><li>Default: `/api-docs`</li></ul> | The url where the swagger-ui will be served |
| options.info | `object` | <ul><li>optional</li></ul> | An object that represents the `info` on the openapi document. For more info see https://swagger.io/docs/specification/basic-structure/ |
| options.info.title | `string` | <ul><li>optional</li><li>Default: package name taken from your package.json</li></ul> | |
| options.info.description | `string` | <ul><li>optional</li><li>Default: package description taken from your package.json</li></ul> | |
| options.info.version | `string` | <ul><li>optional</li><li>Default: package version taken from your package.json</li></ul> | |
| options.tags | `object[]` | <ul><li>optional</li></ul> | List of tags following the openapi specifications |
| options.tags.[*].name | `string` | | The tag name. |
| options.tags.[*].description | `string` | <ul><li>optional</li></ul> | The tag description |
| options.servers | `object[]` | <ul><li>optional</li></ul> | List of servers following the openapi specifications. See https://swagger.io/docs/specification/api-host-and-base-path/ |
| options.servers[*].url | `string` | | |
| options.servers[*].description | `string` | <ul><li>optional</li></ul> | |
| options.externalDocs | `object` | <ul><li>optional</li></ul> | External documents definition following the openapi specifications. |
| options.externalDocs.url | `string` | | |
| options.externalDocs.description | `string` | <ul><li>optional</li></ul> | |

<hr>

```ts
registerSchema(name: string, schema: SchemaDef): void
```

Defines a schema on the openapi document

**Params:**

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| name | `string` | | The name of the schema in the openapi document |
| schema | `object` | | A schema object following openapi specifications. See https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schemaObject |

### Decorators

#### Class Decorators

```ts
@WithDefinitions(options: WithDefinitionsOpts)
```

Enables openapi definitions for a controller class (using `@Controller()` from `@decorators/express`)

**Params:**

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| options | `object` |  |  |
| options.tags | `string[]` | <ul><li>optional</li></ul> | Tags to be applied to all routes on the controller |
| options.basePath | `string` |  | The base path for all routes on the controller |

<hr>

```ts
@Schema(name?: string)
```

Defines a new schema on the openapi document. Internally uses `registerSchema`.

**Params:**

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| name | `string` | <ul><li>optional</li><li>Default: The class name</li></ul> | The name of the schema |

#### Method Decorators - Route documentation

```ts
@Summary(summary: string)
```
Defines the summary of the operation

**Params:**

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| summary | `string` |  | The operation's summary |

<hr>

```ts
@Description(description: string)
```
Defines the description of the operation

**Params:**

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| description | `string` |  | The operation's description |

<hr>

```ts
@Param(name: string, location: ParamLocation, options: ParamOptions)
```
Adds a param definition to the operation

**Params:**

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| name | `string` |  | The parameter name |
| location | `string` | <ul><li>oneOf: `query`, `header`, `path` or `cookie`</li></ul> | Where the parameter is located |
| options | `object` | <ul><li>optional</li></ul>  | Options for the parameter following openapi specifications |
| options.description | `string` | <ul><li>optional</li></ul>  |  |
| options.required | `boolean` | <ul><li>optional</li></ul>  |  |
| options.deprecated | `boolean` | <ul><li>optional</li></ul>  |  |
| options.allowEmptyValue | `boolean` | <ul><li>optional</li></ul>  |  |

**Note:**

When using `@Query()`, `@Params()`, `@Headers()` or `@Cookies()` from `@decorators/express` defining
the name attribute, a basic parameter definition is automatically added to the openapi document.
This definition is equivalent to calling `@Param(name, location)` without passing options.

If you need to define extra options, a new call of `@Param(name, location, options)` will override the automatic definition.

**Examples:**

```ts
class Constructor {
  @Get('/:id')
  public getById(@Param('id') id, @Response() res) {
      // ...
  }
}
```
produces
```
...
"parameters": [
  { "name": "id", "in": "path", "required": true }
]
...
```
```ts
class Constructor {
  @Get('/:id')
  @Param('id', 'path', { required: true })
  public getById(@Request() req, @Response() res) {
      const id = req.params.id;
      // ...
  }
}
```
also produces
```
...
"parameters": [
  { "name": "id", "in": "path", "required": true }
]
...
```

<hr>

```ts
@Tags(tag: string, ...tags: string[])
```

Defines one or more tags for the operation. If no tags are defined on method nor class level,
then the class name will be used as default tag

**Params:**

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| tag | `string` |  |  |
| tags | `string[]` | <ul><li>optional</li></ul> |  |

<hr>

```ts
@Deprecated()
```

Marks an operation as deprecated on the openapi document

<hr>

```ts
@BodyContent(mediaType: string, schema: SchemaDef)
```

Marks an operation as deprecated on the openapi document

**Params:**

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| mediaTye | `string` |  | Media type definition complying with [RFC 6838](http://tools.ietf.org/html/rfc6838) |
| schema | `object` |  | A schema definition following openapi specifications |

<hr>

```ts
@Responses(def: { [key: string]: ResponseDescriptor })
```

Defines one or more responses for the operation

**Params:**

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| def | `object` |  | A map of responses following openapi specifications. See https://swagger.io/docs/specification/describing-responses/ |
| def\[*] | `object` |  |  |
| def\[*].description | `string` |  | The description for the response |
| def\[*].content | `object` | |

<hr>

```ts
@OpenApiResponse(status: string | number, description: string)
```

Defines the description for a response

**Params:**

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| status | `string | number` |  | The response status |
| description | `string` |  | The description |

<hr>

```ts
@OpenApiResponse(status: string | number, produces: string, schema: SchemaDef)
```

Defines one response schema for the operation

**Params:**

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| status | `string` `number` |  | The response status |
| produces | `string` |  | The media type described |
| schema | `object` |  | A schema definition following the openapi specifications |

#### Property Decorators - Schema property

```ts
@Property(opts: SchemaDef & { required?: boolean })
```

Declares a property on a class using `@Schema()` decorator

**Params:**

| Name | Type | Attribute | Description |
| ---- |----- | --------- | ----------- |
| opts | `object` |  | A property definition following the openapi specifications |

