import { test, expect } from "bun:test"
import { readFileSync } from "node:fs"

const root = process.cwd()

function read(rel: string): string {
  return readFileSync(`${root}/${rel}`, "utf8")
}

const navbar = read("src/components/layout/Navbar.tsx")
const page = read("src/app/page.tsx")
const scrollspy = read("src/components/ui/ScrollSpy.tsx")
const palette = read("src/components/ui/CommandPalette.tsx")
const projectsSection = read("src/components/sections/Projects.tsx")

test("Navbar registers the projects nav item with matching href", () => {
  expect(navbar).toContain("{ key: 'projects', href: '#projects' }")
})

test("page.tsx imports and renders the Projects section", () => {
  expect(page).toContain("import { Projects } from '@/components/sections/Projects'")
  expect(page).toContain("<Projects />")
})

test("Projects section renders the #projects anchor", () => {
  expect(projectsSection).toContain('id="projects"')
})

test("Projects section uses the GitHub link with safe rel/target", () => {
  expect(projectsSection).toContain('target="_blank"')
  expect(projectsSection).toContain('rel="noopener noreferrer"')
  expect(projectsSection).toContain("project.repoUrl")
})

test("ScrollSpy lists 'projects' and keeps SECTION_IDS / label arrays aligned", () => {
  const ids = (scrollspy.match(/const SECTION_IDS = \[(.*?)\]/s)?.[1] ?? "")
    .split(",")
    .map((s) => s.trim().replace(/'/g, ""))
    .filter(Boolean)
  const labelsId = (scrollspy.match(/const LABELS_ID = \[(.*?)\]/s)?.[1] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  const labelsEn = (scrollspy.match(/const LABELS_EN = \[(.*?)\]/s)?.[1] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  expect(ids).toContain("projects")
  expect(ids.length).toBe(labelsId.length)
  expect(ids.length).toBe(labelsEn.length)
})

test("CommandPalette includes a projects navigation command", () => {
  expect(palette).toContain("commandPalette.goProjects")
  expect(palette).toContain("scrollTo('projects')")
})
