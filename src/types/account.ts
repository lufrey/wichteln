import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3, "Name ist zu kurz"),
  email: z.string().email("Keine gültige E-Mail"),
});

export const getUserSchema = z.object({
  email: z.string().email("Keine gültige E-Mail"),
});
