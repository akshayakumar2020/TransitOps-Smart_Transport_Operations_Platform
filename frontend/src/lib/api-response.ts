import { NextResponse } from "next/server";

/**
 * Standardised API response envelope.
 * Mirrors the `{ success, ... }` contract used by the Spring Boot backend
 * so the frontend can be agnostic to which backend serves it.
 */

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(
    { success: true, ...data },
    { status }
  );
}

export function fail(message: string, status = 400, errors?: unknown) {
  return NextResponse.json(
    { success: false, message, ...(errors ? { errors } : {}) },
    { status }
  );
}
