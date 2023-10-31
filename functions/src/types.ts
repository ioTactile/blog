import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp
} from 'firebase-admin/firestore'

export { Timestamp }

export type Image = {
  name: string
  url: string
  ref: string
}

export const userConverter = {
  toFirestore: (user: User): DocumentData => user,
  fromFirestore(snapshot: QueryDocumentSnapshot<User>): User {
    return snapshot.data()
  }
}

export type User = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role?: { admin: true }
  creationDate: Timestamp
  updateDate: Timestamp
}

export const articleConverter = {
  toFirestore: (article: Article): DocumentData => article,
  fromFirestore(snapshot: QueryDocumentSnapshot<Article>): Article {
    return snapshot.data()
  }
}

export type Article = {
  id: string
  images: Image[]
  title: string
  description: string
  content: string
  slug: string
  comments?: Comment[]
  creationDate: Timestamp
  updateDate: Timestamp
}

export type Comment = {
  id: string
  articleId: string
  userId?: string
  firstName: string
  lastName: string
  content: string
  creationDate: Timestamp
}
