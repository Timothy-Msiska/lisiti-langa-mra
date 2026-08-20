"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { startDraw } from "@/lib/draw"

const COOKIE = "operator"

export async function isSignedIn(): Promise<boolean> {
  const store = await cookies()
  return !!store.get(COOKIE)?.value
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  if (!email) return
  const store = await cookies()
  store.set(COOKIE, email, { httpOnly: true, sameSite: "lax", path: "/" })
  redirect("/control")
}

export async function startDrawAction() {
  if (!(await isSignedIn())) redirect("/")
  startDraw()
  redirect("/spin")
}

export async function signOut() {
  const store = await cookies()
  store.delete(COOKIE)
  redirect("/")
}
