export type WithId<T, P extends string = 'id'> = T & { [key in P]: string };
