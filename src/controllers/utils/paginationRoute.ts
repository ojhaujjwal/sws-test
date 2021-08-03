import * as queryString from 'querystring';
import { omit } from 'lodash';
import { Request } from 'express';

export function paginationRoute(request: Request): string {
  const queryObject = omit(request.query, ['page', 'perPage']);
  return `${request.path}?${queryString.encode(queryObject)}`;
}
