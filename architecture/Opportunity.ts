export interface Opportunity {
  _id: string
  title: string
  subtitle?: string
  description: string
  url: string
  source: {
    name: string
    url: string
  }
}
