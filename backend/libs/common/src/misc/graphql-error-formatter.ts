import { HttpException } from '@nestjs/common';
import { ExecutionResult, GraphQLError } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';

type CleanedError = { statusCode: number; response: string };
type Execution = ExecutionResult<ObjMap<unknown>, ObjMap<unknown>>;

export class GraphQLErrorFormatter {
  static formatError(execution: Execution) {
    if (!execution.errors) return;

    let status = 500;

    execution.errors = execution.errors.map((error) => {
      if (!error.originalError) return error;

      const cleaned = GraphQLErrorFormatter.cleanError(error.originalError);
      status = status === 500 ? cleaned.statusCode : 207;
      return GraphQLErrorFormatter.mergeGraphQLError(cleaned, error);
    });

    return { statusCode: status, response: execution };
  }

  private static mergeGraphQLError(clean: CleanedError, err: GraphQLError) {
    return new GraphQLError(clean.response, {
      source: err.source,
      positions: err.positions,
      path: err.path,
      originalError: err.originalError,
      nodes: err.nodes,
      extensions: {
        status_code: clean.statusCode,
      },
    });
  }

  private static cleanError(err: Error): CleanedError | undefined {
    if (err instanceof HttpException) {
      const res = err.getResponse();

      return {
        statusCode: err.getStatus(),
        response: typeof res === 'string' ? res : res['message'],
      };
    }

    return {
      statusCode: 500,
      response: err.message,
    };
  }
}
