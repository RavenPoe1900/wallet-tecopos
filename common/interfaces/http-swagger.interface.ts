import { ApiResponseOptions, type ApiOperationOptions } from '@nestjs/swagger';

export interface IHttpSwagger {
  apiOperation: ApiOperationOptions;
  apiResponse: ApiResponseOptions;
}
