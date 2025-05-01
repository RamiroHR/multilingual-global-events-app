import { prisma } from './prisma';

// Find user and its password with the user email
export async function findUserByEmail(email: string) {
  const user = prisma.user.findUnique({
    where: { email },
    include: { password: true }
  });
  return user;
}


// Create a new user in the database, set its password
export async function createUser(email: string, username: string, hashedPassword: string) {
  const newUser = prisma.user.create({
    data: {
      email,
      username,
      password : {
        create: {password : hashedPassword }
      }
    },
    include: { password: true }
  });
  return newUser;
}
