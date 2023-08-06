import { registerSchema } from "../helpers";
import { getSchemaMeta } from "../meta";
import { SchemaDef } from "../types";

export function Schema(name?: string): ClassDecorator {
  return (target) => {
    const { properties, required } = getSchemaMeta(target.prototype);
    registerSchema(name || target.name, {
      type: 'object',
      properties,
      required,
    });
  };
}

interface PropertyDef {
  required?: boolean;
}

export function Property(opts: SchemaDef & PropertyDef): PropertyDecorator {
  return (target: any, key: string) => {
    const meta = getSchemaMeta(target);
    const properties = meta.properties = meta.properties || {};
    const { required, ...schema } = opts;
    if (required) {
      meta.required = meta.required || [];
      meta.required.push(key);
    }
    properties[key] = schema;
  };
}
