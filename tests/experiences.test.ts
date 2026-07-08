import { test, expect } from "bun:test"
import { experiences, formatDate } from "../src/data/experiences"

test("experiences have unique ids", () => {
  const ids = experiences.map((e) => e.id)
  expect(new Set(ids).size).toBe(ids.length)
})

test("exactly 4 experience entries after duplicate removal", () => {
  expect(experiences.length).toBe(4)
})

test("the Store Associate duplicate (id 1.5) is removed", () => {
  const storeAssociate = experiences.filter(
    (e) => e.role.en === "Store Associate / Sales Clerk"
  )
  expect(storeAssociate.length).toBe(1)
  expect(storeAssociate[0]!.id).toBe(1)
})

test("ids are sequential 1..4", () => {
  const ids = experiences.map((e) => e.id).sort((a, b) => a - b)
  expect(ids).toEqual([1, 2, 3, 4])
})

test("every experience has bilingual role/company/description/tags", () => {
  for (const e of experiences) {
    expect(e.role.id.length).toBeGreaterThan(0)
    expect(e.role.en.length).toBeGreaterThan(0)
    expect(e.company.id.length).toBeGreaterThan(0)
    expect(e.company.en.length).toBeGreaterThan(0)
    expect(Array.isArray(e.description.id)).toBe(true)
    expect(Array.isArray(e.description.en)).toBe(true)
    expect(e.description.id.length).toBe(e.description.en.length)
    expect(e.tags.id.length).toBeGreaterThan(0)
    expect(e.tags.en.length).toBe(e.tags.id.length)
  }
})

test("all period start values are valid YYYY-MM and parse to a date", () => {
  for (const e of experiences) {
    expect(e.period.start).toMatch(/^\d{4}-\d{2}$/)
    const d = new Date(e.period.start)
    expect(Number.isNaN(d.getTime())).toBe(false)
  }
})

test("formatDate returns the present label for null end", () => {
  expect(formatDate(null, "Present")).toBe("Present")
  expect(formatDate(null, "Sekarang")).toBe("Sekarang")
})

test("formatDate formats a YYYY-MM start as Month Year (en-US)", () => {
  expect(formatDate("2026-04", "Present", "en-US")).toBe("Apr 2026")
  expect(formatDate("2025-01", "Present", "en-US")).toBe("Jan 2025")
})

test("formatDate is locale-aware", () => {
  const en = formatDate("2026-04", "Present", "en-US")
  const id = formatDate("2026-04", "Present", "id-ID")
  expect(en).toBe("Apr 2026")
  expect(typeof id).toBe("string")
  expect(id.length).toBeGreaterThan(0)
})
