export interface Sheet {
  language: string
  slug: string
  title: string
  order: number
  source?: string
  body: string
}

export interface LanguageGroup {
  language: string
  sheets: Sheet[]
}
