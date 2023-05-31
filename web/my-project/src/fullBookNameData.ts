import untyped_BookNames from './key_english.json'
interface KeyEnglishJson {
  resultset: ResultSet;
}

interface ResultSet {
  keys: Key[];
}

interface Key {
  b: number;
  c: number;
  n: string;
  t: string;
  g: number;
}
export const bookNames: KeyEnglishJson = untyped_BookNames as KeyEnglishJson;
  