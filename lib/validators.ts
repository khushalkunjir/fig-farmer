import {z} from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6)
});

export const signupSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6)
}).refine((data) => data.username || data.email, {
  message: 'Username or email is required'
});

export const vendorSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional()
});

export const boxTypeSchema = z.object({
  name: z.string().min(1),
  defaultQtyPerBox: z.number().positive().optional()
});

export const lineItemSchema = z.object({
  boxTypeId: z.string().min(1),
  qtyPerBox: z.number().positive(),
  boxCount: z.number().positive()
});

export const harvestSchema = z.object({
  date: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(lineItemSchema).min(1)
});

export const saleSchema = z.object({
  date: z.string().min(1),
  vendorId: z.string().min(1),
  items: z.array(lineItemSchema).min(1),
  expectedAmount: z.number().nonnegative().optional(),
  notes: z.string().optional()
});

export const confirmSaleSchema = z.object({
  saleId: z.string().min(1),
  finalAmount: z.number().nonnegative(),
  confirmationDate: z.string().min(1)
});
