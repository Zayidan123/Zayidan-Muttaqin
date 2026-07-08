import { test, expect } from "bun:test"
import { useLanguageStore } from "../src/store/language-store"

const store = useLanguageStore

test("nav.projects translation exists in both languages", () => {
  store.getState().setLang("id")
  expect(store.getState().t("nav.projects")).toBe("Proyek")
  store.getState().setLang("en")
  expect(store.getState().t("nav.projects")).toBe("Projects")
})

test("all navbar keys resolve in both languages", () => {
  const keys = ["about", "experience", "projects", "faq", "contact"]
  for (const lang of ["id", "en"] as const) {
    store.getState().setLang(lang)
    for (const k of keys) {
      const val = store.getState().t(`nav.${k}`)
      expect(val).not.toBe(`nav.${k}`) // must not fall back to the key
      expect(val.length).toBeGreaterThan(0)
    }
  }
})

test("projects section translations exist in both languages", () => {
  const keys = ["title", "subtitle", "viewRepo", "viewDemo"]
  for (const lang of ["id", "en"] as const) {
    store.getState().setLang(lang)
    for (const k of keys) {
      const val = store.getState().t(`projects.${k}`)
      expect(val).not.toBe(`projects.${k}`)
    }
  }
})

test("commandPalette.goProjects translation exists in both languages", () => {
  store.getState().setLang("id")
  expect(store.getState().t("commandPalette.goProjects")).toBe("Ke Proyek")
  store.getState().setLang("en")
  expect(store.getState().t("commandPalette.goProjects")).toBe("Go to Projects")
})

test("unknown key falls back to the key itself", () => {
  store.getState().setLang("id")
  expect(store.getState().t("this.key.does.not.exist")).toBe(
    "this.key.does.not.exist"
  )
})

test("toggleLang switches between id and en", () => {
  store.getState().setLang("id")
  store.getState().toggleLang()
  expect(store.getState().lang).toBe("en")
  store.getState().toggleLang()
  expect(store.getState().lang).toBe("id")
})
