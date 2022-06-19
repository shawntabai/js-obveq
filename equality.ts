import { GenericObject } from './hash';

export function areEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 == null) {
    return obj2 == null;
  } else if (obj2 == null) {
    return false;
  }

  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (typeof obj1 === 'object') {
    return areObjectsEqual(obj1 as GenericObject, obj2 as GenericObject);
  } else {
    return obj1 === obj2;
  }
}

function areObjectsEqual(obj1: GenericObject, obj2: GenericObject): boolean {
  const typeName1 = obj1.constructor.name;
  const typeName2 = obj2.constructor.name;
  if (typeName1 !== typeName2) {
    return false;
  }

  const props1 = Object.getOwnPropertyNames(obj1);
  const props2 = Object.getOwnPropertyNames(obj2);
  if (props1.length !== props2.length) {
    return false;
  }
  for (const field of props1) {
    if (!props2.includes(field)) {
      return false;
    }
    const value1 = (obj1 as Record<string, unknown>)[field];
    const value2 = (obj2 as Record<string, unknown>)[field];
    if (!areEqual(value1, value2)) {
      return false;
    }
  }
  return true;
}
