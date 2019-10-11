import { GraphQLError } from './graph-qlerror';

export class GraphQLResponse {
    data: any;
    errors: GraphQLError[];
}
