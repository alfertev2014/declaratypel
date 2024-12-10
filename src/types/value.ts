
export type DeclPrimitiveValue = string | number | boolean | null | undefined;

export type DeclStructValue = { [key: string] : DeclValue };

export type DeclValue = DeclPrimitiveValue | DeclStructValue | DeclValue[];
