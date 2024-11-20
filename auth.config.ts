import Google from "next-auth/providers/Google"
import type { NextAuthConfig } from "next-auth"
 
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [Google],
} satisfies NextAuthConfig