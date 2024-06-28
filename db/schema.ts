import { pgTable, text } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  planId: text('plan_id'),
  name: text('name').notNull(),
  userId: text('user_id').notNull(),
})

export const inserAcccountSchema = createInsertSchema(accounts)

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  planId: text('plan_id'),
  name: text('name').notNull(),
  userId: text('user_id').notNull(),
})

export const inserCategorySchema = createInsertSchema(categories)
