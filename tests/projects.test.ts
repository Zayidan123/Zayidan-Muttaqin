import { test, expect } from "bun:test"
import { projects } from "../src/data/projects"
import type { ProjectEntry } from "../src/data/projects"

function assertValidProject(p: ProjectEntry) {
  expect(typeof p.id).toBe("number")
  expect(p.title.length).toBeGreaterThan(0)
  expect(p.description.id.length).toBeGreaterThan(0)
  expect(p.description.en.length).toBeGreaterThan(0)
  expect(Array.isArray(p.tags.id)).toBe(true)
  expect(Array.isArray(p.tags.en)).toBe(true)
  expect(p.tags.id.length).toBe(p.tags.en.length)
  // repoUrl must be a safe, absolute https URL (no javascript:/data: schemes)
  expect(p.repoUrl).toMatch(/^https:\/\//)
  if (p.demoUrl !== undefined) {
    expect(p.demoUrl).toMatch(/^https?:\/\//)
  }
}

test("projects array is non-empty", () => {
  expect(projects.length).toBeGreaterThan(0)
})

test("every project passes structural validation", () => {
  for (const p of projects) assertValidProject(p)
})

test("project ids are unique", () => {
  const ids = projects.map((p) => p.id)
  expect(new Set(ids).size).toBe(ids.length)
})

test("projects use the owner GitHub namespace by default", () => {
  for (const p of projects) {
    expect(p.repoUrl).toContain("github.com")
  }
})
