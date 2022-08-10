import { HttpException } from '@nestjs/common';
import { ExecutionResult } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';

type CleanedError = { code: number; response: string };
type Execution = ExecutionResult<ObjMap<unknown>, ObjMap<unknown>>;

export class GraphQLErrorFormatter {
  static formatError(execution: Execution) {
    let status = 500;

    const errors = execution.errors.map((error) => {
      const cleaned = this.cleanError(error.originalError);
      if (cleaned) {
        error.message = cleaned.response;
        status = status === 500 ? cleaned.code : 207;
      }
      return error;
    });

    execution.errors = errors;

    return { statusCode: status, response: execution };
  }

  private static cleanError(err: Error): CleanedError | undefined {
    if (err instanceof HttpException) {
      const res = err.getResponse();

      return {
        code: err.getStatus(),
        response:
          typeof res === 'string' ? res : JSON.stringify(err.getResponse()),
      };
    }
  }
}
