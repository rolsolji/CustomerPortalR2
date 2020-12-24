import { Observable } from 'rxjs';

export interface Sort<T> {
    property: keyof T;
    order: 'asc' | 'desc';
}

export interface Delete<T> {
    item: T;
}

export interface PageRequest<T> {
    page: number;
    size: number;
    sort?: Sort<T>;
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    size: number;
    number: number;
}

export type PaginatedEndpoint<T, Q, D> = (pageable: PageRequest<T>, query: Q, hasDelete: D, data: T[]) => Observable<Page<T>>
