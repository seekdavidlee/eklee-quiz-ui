export class QueryParameter {
    name: string;
    comparison: Comparison;
    value: string;
}

export enum Comparison {
    Equals,
    Contains
}
