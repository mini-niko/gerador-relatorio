import { PrismaClient } from "@/prisma/generated/client";
import { randomNumber } from "@/lib/utils";
import { faker } from "@faker-js/faker";
import { Decimal } from "@prisma/client/runtime/client";
import cliProgress from "cli-progress";

export const USERS_QUANTITY = parseInt(
  process.env.PRISMA_USER_QUANTITY || "30000"
);

type Transactions = {
  type: "CREDIT" | "DEBIT";
  value: Decimal;
  dueDate: Date;
};

const prisma = new PrismaClient();

async function populateDatabase() {
  console.log();

  const progressBar = getProgressBar();
  progressBar.stop();
  progressBar.start(USERS_QUANTITY, 0);

  for (let i = 0; i < USERS_QUANTITY; i++) {
    const transactions = getTransactions();
    await insertUserWithTransactions(transactions);

    progressBar.update(i + 1);
  }

  progressBar.stop();
}

function getProgressBar() {
  const progressBar = new cliProgress.SingleBar({
    format: `{percentage}% [{bar}] {value}/{total}`,
    barCompleteChar: "⣿",
    barIncompleteChar: " ",
    hideCursor: true,
  });

  return progressBar;
}

function getTransactions() {
  const transactions = [];
  const transactionsQuantity = randomNumber(50, 200);

  for (let j = 0; j < transactionsQuantity; j++) {
    transactions.push({
      type: faker.helpers.arrayElement(["CREDIT", "DEBIT"]),
      value: new Decimal(randomNumber(50, 99999, 2)),
      dueDate: faker.date.future({
        refDate: "2026-01-01T00:00:00.000Z",
      }),
    });
  }

  return transactions;
}

async function insertUserWithTransactions(transactions: Transactions[]) {
  try {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        birthDay: faker.date.between({
          from: "1970-01-01",
          to: "2005-12-31",
        }),
        transactions: {
          createMany: {
            data: transactions,
          },
        },
      },
    });
  } catch {
    insertUserWithTransactions(transactions);
  }
}

populateDatabase().then(() => {
  prisma.$disconnect();
});
