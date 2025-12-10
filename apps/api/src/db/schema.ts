import { pgTable, text, timestamp, uuid, boolean, integer, jsonb, varchar, date, decimal } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  emailVerified: boolean('email_verified').default(false),
  role: varchar('role', { length: 20 }).default('student').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
  deletedAt: timestamp('deleted_at'),
})

// Student profiles (additional student-specific info)
export const studentProfiles = pgTable('student_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  ssn: varchar('ssn_encrypted', { length: 255 }), // Encrypted
  dateOfBirth: date('date_of_birth'),
  citizenship: varchar('citizenship', { length: 50 }),
  alienRegistrationNumber: varchar('alien_registration_number', { length: 50 }),
  maritalStatus: varchar('marital_status', { length: 20 }),
  veteranStatus: boolean('veteran_status'),
  drugConviction: boolean('drug_conviction'),
  selectiveService: boolean('selective_service'),
  highSchoolCompletionStatus: varchar('hs_completion_status', { length: 50 }),
  highSchoolGraduationDate: date('hs_graduation_date'),
  highSchoolName: varchar('hs_name', { length: 255 }),
  highSchoolCity: varchar('hs_city', { length: 100 }),
  highSchoolState: varchar('hs_state', { length: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// FAFSA Applications
export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  academicYear: varchar('academic_year', { length: 9 }).notNull(), // e.g., "2024-2025"
  status: varchar('status', { length: 30 }).default('draft').notNull(),
  currentStep: integer('current_step').default(1).notNull(),
  isDependent: boolean('is_dependent'),
  dependencyStatus: jsonb('dependency_status'),
  
  // Student Financial Info
  studentAgi: decimal('student_agi', { precision: 12, scale: 2 }),
  studentTaxesPaid: decimal('student_taxes_paid', { precision: 12, scale: 2 }),
  studentIncome: decimal('student_income', { precision: 12, scale: 2 }),
  studentAssets: decimal('student_assets', { precision: 12, scale: 2 }),
  studentUntaxedIncome: decimal('student_untaxed_income', { precision: 12, scale: 2 }),
  studentTaxReturnStatus: varchar('student_tax_return_status', { length: 50 }),
  
  // Parent Financial Info (for dependent students)
  parentAgi: decimal('parent_agi', { precision: 12, scale: 2 }),
  parentTaxesPaid: decimal('parent_taxes_paid', { precision: 12, scale: 2 }),
  parentIncome: decimal('parent_income', { precision: 12, scale: 2 }),
  parentAssets: decimal('parent_assets', { precision: 12, scale: 2 }),
  parentUntaxedIncome: decimal('parent_untaxed_income', { precision: 12, scale: 2 }),
  parentTaxReturnStatus: varchar('parent_tax_return_status', { length: 50 }),
  numberOfParentHousehold: integer('parent_household_size'),
  numberOfInCollege: integer('number_in_college'),
  
  // Calculated fields
  efc: integer('efc'), // Expected Family Contribution
  sai: integer('sai'), // Student Aid Index (new calculation)
  pellEligible: boolean('pell_eligible'),
  
  // Timestamps
  submittedAt: timestamp('submitted_at'),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Parent Information (for dependent students)
export const parentInfo = pgTable('parent_info', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationId: uuid('application_id').references(() => applications.id).notNull(),
  parentNumber: integer('parent_number').notNull(), // 1 or 2
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  dateOfBirth: date('date_of_birth'),
  ssn: varchar('ssn_encrypted', { length: 255 }), // Encrypted
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  occupation: varchar('occupation', { length: 100 }),
  employerName: varchar('employer_name', { length: 255 }),
  maritalStatus: varchar('marital_status', { length: 20 }),
  state: varchar('state', { length: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// School selections
export const schoolSelections = pgTable('school_selections', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationId: uuid('application_id').references(() => applications.id).notNull(),
  schoolId: varchar('school_id', { length: 10 }).notNull(), // Federal School Code
  schoolName: varchar('school_name', { length: 255 }).notNull(),
  housingPlan: varchar('housing_plan', { length: 50 }), // on-campus, off-campus, with-parent
  priority: integer('priority').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Documents
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationId: uuid('application_id').references(() => applications.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // tax-return, w2, bank-statement, etc.
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  storageKey: varchar('storage_key', { length: 500 }).notNull(),
  status: varchar('status', { length: 30 }).default('pending').notNull(),
  ocrData: jsonb('ocr_data'),
  verificationStatus: varchar('verification_status', { length: 30 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Schools database (for search)
export const schools = pgTable('schools', {
  id: varchar('id', { length: 10 }).primaryKey(), // Federal School Code
  name: varchar('name', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 2 }).notNull(),
  zip: varchar('zip', { length: 10 }),
  type: varchar('type', { length: 50 }), // public, private, proprietary
  website: varchar('website', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  inStateTuition: integer('in_state_tuition'),
  outStateTuition: integer('out_state_tuition'),
  roomAndBoard: integer('room_and_board'),
  averageAid: integer('average_aid'),
  isActive: boolean('is_active').default(true),
})

// Audit log for FERPA compliance
export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  resource: varchar('resource', { length: 100 }).notNull(),
  resourceId: uuid('resource_id'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Sessions (for JWT refresh tokens)
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  refreshToken: text('refresh_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Define relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  applications: many(applications),
  documents: many(documents),
  sessions: many(sessions),
}))

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
  parents: many(parentInfo),
  schoolSelections: many(schoolSelections),
  documents: many(documents),
}))

export const parentInfoRelations = relations(parentInfo, ({ one }) => ({
  application: one(applications, {
    fields: [parentInfo.applicationId],
    references: [applications.id],
  }),
}))

export const schoolSelectionsRelations = relations(schoolSelections, ({ one }) => ({
  application: one(applications, {
    fields: [schoolSelections.applicationId],
    references: [applications.id],
  }),
}))

export const documentsRelations = relations(documents, ({ one }) => ({
  application: one(applications, {
    fields: [documents.applicationId],
    references: [applications.id],
  }),
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}))

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Application = typeof applications.$inferSelect
export type NewApplication = typeof applications.$inferInsert
export type School = typeof schools.$inferSelect
export type Document = typeof documents.$inferSelect
