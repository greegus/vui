import type { ValueParser } from "@/types";

export const NumberValueParser: ValueParser<string, number> = {
  stringify: (value: number) => String(value),
  parse: (value: string) => Number(value),
}
