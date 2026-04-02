import { IPayload } from 'common/generic/payload.interface';

export type RequestWithUser = Request & {
  user: IPayload;
};
