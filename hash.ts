export type GenericObject = Record<string | number | symbol, unknown>;

export function toHashCode(value: unknown): number {
  switch (typeof value) {
    case 'function':
    case 'undefined':
      return 0;
    case 'boolean':
      return value ? 1 : 0;
    case 'bigint':
    case 'number':
      return Number(value) % Number.MAX_SAFE_INTEGER;
    case 'string':
      return hashString(value);
    case 'symbol':
      return hashString(value.toString());
    case 'object':
      return hashObject(value as GenericObject);
  }
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    hash = (hash << 5) - hash + code;
    hash |= 0;
  }
  return hash;
}

function hashObject(value: GenericObject): number {
  let hash = hashString(value.constructor.name);
  for (const field of Object.getOwnPropertyNames(value)) {
    hash = (hash << 5) - hash + toHashCode(field);
    hash = (hash << 5) - hash + toHashCode(value[field]);
    hash |= 0;
  }
  return hash;
}
