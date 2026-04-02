type Prop<T, K extends PropertyKey, Fallback = never> = K extends keyof T
  ? T[K]
  : Fallback;

export type PrismaWhereArg<T> = Prop<T, 'where', Record<string, any>>;
export type PrismaOrderByArg<T> = Prop<T, 'orderBy', unknown>;
export type PrismaSelectArg<T> = Prop<T, 'select', unknown>;
export type PrismaIncludeArg<T> = Prop<T, 'include', unknown>;

export type PrismaCountArgs<TFindManyArgs> = {
  where?: PrismaWhereArg<TFindManyArgs>;
};

export abstract class PrismaCrudDelegate<
  TEntity,
  TCreateArgs extends object,
  TFindManyArgs extends object,
  TFindUniqueArgs extends object,
  TUpdateArgs extends object,
  TDeleteArgs extends object,
> {
  abstract create(args: TCreateArgs): Promise<TEntity>;
  abstract count(args?: PrismaCountArgs<TFindManyArgs>): Promise<number>;
  abstract findMany(args: TFindManyArgs): Promise<TEntity[]>;
  abstract findUnique(args: TFindUniqueArgs): Promise<TEntity | null>;
  abstract update(args: TUpdateArgs): Promise<TEntity>;
  abstract delete(args: TDeleteArgs): Promise<TEntity>;
  $transaction?: <A extends Promise<unknown>[]>(
    ops: [...A],
  ) => Promise<{ [K in keyof A]: Awaited<A[K]> }>;
}
