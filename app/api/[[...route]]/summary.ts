import { z } from 'zod'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { differenceInDays, parse, subDays } from 'date-fns'
import { accounts, categories, transactions } from '@/db/schema'
import { and, desc, eq, gte, lt, lte, sql, sum } from 'drizzle-orm'
import { db } from '@/db/drizzle'
import { calculatePorcentageChange, fillMissingDays } from '@/lib/utils'

const app = new Hono().get(
  '/',
  clerkMiddleware(),
  zValidator(
    'query',
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })
  ),
  async (c) => {
    const auth = getAuth(c)
    const { from, to, accountId } = c.req.valid('query')

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const defaultTo = new Date()
    const defaultFrom = subDays(defaultTo, 30)

    const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom
    const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo

    const periodLlength = differenceInDays(endDate, startDate) + 1
    const lastPeriodStart = subDays(startDate, periodLlength)
    const lastPeriodEnd = subDays(endDate, periodLlength)

    async function fetchFinantialData(
      userId: string,
      startDate: Date,
      endDate: Date
    ) {
      const data = await db
        .select({
          income:
            sql`SUM(CASE WHEN ${transactions.amount}>= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          expenses:
            sql`SUM(CASE WHEN ${transactions.amount}< 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          remaining: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, userId),
            gte(transactions.date, new Date(startDate)),
            lte(transactions.date, new Date(endDate))
          )
        )

      return data
    }

    const [currentPeriod] = await fetchFinantialData(
      auth.userId,
      startDate,
      endDate
    )

    const [lastPeriod] = await fetchFinantialData(
      auth.userId,
      lastPeriodStart,
      lastPeriodEnd
    )

    const incomeChange = calculatePorcentageChange(
      currentPeriod.income,
      lastPeriod.income
    )

    const expensesChange = calculatePorcentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses
    )
    const remainingChange = calculatePorcentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining
    )

    const category = await db
      .select({
        name: categories.name,
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          lt(transactions.amount, 0),
          gte(transactions.date, new Date(startDate)),
          lte(transactions.date, new Date(endDate))
        )
      )
      .groupBy(categories.name)
      .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`))

    const topCategories = category.slice(0, 3)
    const otherCategories = category.slice(3)
    const otherSum = otherCategories.reduce((acc, cat) => acc + cat.value, 0)

    const finalCatefgories = topCategories
    if (otherCategories.length > 0) {
      finalCatefgories.push({ name: 'Other', value: otherSum })
    }

    const activeDays = await db
      .select({
        date: transactions.date,
        income:
          sql`SUM(CASE WHEN ${transactions.amount}>= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
            Number
          ),
        expenses:
          sql`SUM(CASE WHEN ${transactions.amount}< 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
            Number
          ),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, new Date(startDate)),
          lte(transactions.date, new Date(endDate))
        )
      )
      .groupBy(transactions.date)
      .orderBy(transactions.date)

    const days = fillMissingDays(activeDays, startDate, endDate)

    return c.json({
      data: {
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange,
        categories: finalCatefgories,
        days,
      },
    })
  }
)

export default app
