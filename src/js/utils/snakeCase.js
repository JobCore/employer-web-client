import { snakeCase } from 'snake-case';

export const normalizeToSnakeCase = (map) => {
    const entries = Object.entries(map);
    const newMap = {};
    entries.forEach(([key, value]) => {
      newMap[snakeCase(key)] = value;
    });
    return newMap;
  };