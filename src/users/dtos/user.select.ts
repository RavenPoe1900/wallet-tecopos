import { type Prisma } from '@prisma/client';

export const userSelectWithoutPassword: Prisma.UserSelect = {
  id: true,
  email: true,
  createdAt: true,
} satisfies Prisma.UserSelect;
