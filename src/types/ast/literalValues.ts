
export type DeclPrimitiveValue = string | number | boolean | bigint | null | undefined;

export type DeclAnyValue = DeclPrimitiveValue | object

export type DeclStructValue = Record<string, DeclAnyValue>;

export type DeclValue = DeclPrimitiveValue | Array<DeclAnyValue> | DeclStructValue;
