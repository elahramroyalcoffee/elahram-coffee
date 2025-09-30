import * as z from "zod";

z.config(z.locales.ar());

export const addCategorySchema = z.object({
  title: z.string().min(1),
  // image: z.refine((val: any) => val.size > 0),
});

export const editCategorySchema = z.object({
  title: z.string().min(1),
  // image: z.file().min(1, {
  //   error: "Image Is Required",
  // }),
});

export const sizesSchema = z.object({
  weight: z.number().min(1),
  size: z.literal(["gm", "kg"]),
});

export const grindsSchema = z.object({
  name: z.string().min(1),
});

export const addOnsSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(1),
});

export const productSchema = z.object({
  title: z.string().min(0),
  description: z.string().min(0),
  category_id: z.number(),
});

export const shipmentSchema = z.object({
  price: z.number().min(0, "يجب أن يكون السعر أكبر من أو يساوي صفر"),
  is_active: z.boolean().optional(),
});

export const updateShipmentPriceSchema = z.object({
  shipment_id: z.number().min(1),
  price: z.number().min(0, "يجب أن يكون السعر أكبر من أو يساوي صفر"),
});
