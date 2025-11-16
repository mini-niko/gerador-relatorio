import prisma from "@/prisma/client";
import { UserOrderByWithRelationInput } from "@/prisma/generated/models";

type GetAllUsersOptions = {
  orderBy?: UserOrderByWithRelationInput;
  page?: number;
  pageSize?: number;
};

async function getAllUsers(options?: GetAllUsersOptions) {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 25;

  const [data, count] = await Promise.all([
    await prisma.user.findMany({
      orderBy: options?.orderBy || { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count(),
  ]);

  const totalPages = count / pageSize;

  return { data, count, totalPages };
}

const users = {
  getAllUsers,
};

export default users;
