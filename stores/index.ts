import type {
  QueryDocumentSnapshot,
  Timestamp as FirestoreTimestamp,
  FirestoreDataConverter,
} from '@firebase/firestore';
import { defineStore } from 'pinia';
import type { Timestamp, User, Article } from '~/functions/src/types';

export const useStore = defineStore('main', () => {
  const av1Support = ref<null | boolean>(null);
  const avifSupport = ref<null | boolean>(null);
  const vp9Support = ref<null | boolean>(null);
  const webpSupport = ref<null | boolean>(null);
  const search = ref('');

  return {
    av1Support,
    avifSupport,
    vp9Support,
    webpSupport,
    search,
  };
});

type NestedTypeMapper<T, I, O> = T extends I
  ? O
  : {
      [Property in keyof T]: T[Property] extends Date | FirestoreTimestamp | Timestamp
        ? T[Property] extends I
          ? O
          : T[Property]
        : NestedTypeMapper<T[Property], I, O>;
    };

type DatabaseUserType = NestedTypeMapper<User, Timestamp, FirestoreTimestamp>;
export type LocalUserType = NestedTypeMapper<User, Timestamp, Date>;
export const userConverter: FirestoreDataConverter<LocalUserType> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DatabaseUserType>, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      creationDate: data.creationDate.toDate(),
      updateDate: data.updateDate.toDate(),
    };
  },
};

type DatabaseArticleType = NestedTypeMapper<Article, Timestamp, FirestoreTimestamp>;
export type LocalArticleType = NestedTypeMapper<Article, Timestamp, Date>;
export const articleConverter: FirestoreDataConverter<LocalArticleType> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DatabaseArticleType>, options) => {
    const data = snapshot.data(options);
    const comments = data.comments
      ? data.comments.map((comment) => {
          return {
            ...comment,
            createdAt: comment.createdAt.toDate(),
          };
        })
      : [];

    return {
      ...data,
      id: snapshot.id,
      creationDate: data.creationDate.toDate(),
      updateDate: data.updateDate.toDate(),
      comments,
    };
  },
};
