import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IResponse<T> {
  statusCode: number;
  status: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  IResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = response.statusCode;
    const status = statusCode >= 200 && statusCode < 300;

    return next.handle().pipe(
      map((res) => {
        if (res?.data && res?.total !== undefined) {
          return {
            statusCode,
            status,
            message: res?.message || 'Success',
            ...res,
          };
        }
        return {
          statusCode,
          status,
          message: res?.message || 'Success',
          data: res?.data !== undefined ? res.data : res,
        };
      }),
    );
  }
}
