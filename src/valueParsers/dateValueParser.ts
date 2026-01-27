import type { ValueParser } from "@/types";

export const DateValueParser: ValueParser<string, Date> = {
  stringify: (value: Date) => value.toISOString().slice(0, 10),
  parse: (value: string) => new Date(value),
};
