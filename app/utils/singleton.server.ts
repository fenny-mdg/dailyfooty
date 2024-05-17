// Borrowed & modified from https://github.com/jenseng/abuse-the-platform/blob/main/app/utils/singleton.ts
// Thanks @jenseng!

export const singleton = async <Value>(
  name: string,
  valueFactory: () => Value,
): Promise<Value> => {
  const g = global as unknown as { __singletons: Record<string, unknown> };
  g.__singletons ??= {};
  g.__singletons[name] ??= await valueFactory();
  return g.__singletons[name] as Value;
};
