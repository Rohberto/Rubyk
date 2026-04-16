export interface Post {
  slug:        string
  title:       string
  date:        string
  excerpt:     string
  author:      string
  tags:        string[]
  readTime:    string
  coverImage?: string
  content?:    string
}

export function formatPostDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(dateStr))
  } catch { return dateStr }
}