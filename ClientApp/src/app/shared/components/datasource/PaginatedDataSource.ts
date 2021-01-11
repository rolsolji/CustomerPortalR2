import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, startWith, map, share, tap } from 'rxjs/operators';
import {Page, Sort, PaginatedEndpoint, Delete} from './Page';
import { indicate } from './Operators';

export interface SimpleDataSource<T> extends DataSource<T> {
    connect(): Observable<T[]>;
    disconnect(): void;
}

export class PaginatedDataSource<T, Q> implements SimpleDataSource<T> {
    private pageNumber = new Subject<number>();
    private query: BehaviorSubject<Q>;
    private sort: BehaviorSubject<Sort<T>>;
    private hasDelete: BehaviorSubject<Delete<T>>;
    private loading = new Subject<boolean>();

    public loading$ = this.loading.asObservable();
    public page$: Observable<Page<T>>;

    constructor(
        private endpoint: PaginatedEndpoint<T, Q, Delete<T>>,
        initialSort: Sort<T>,
        initialQuery: Q,
        public pageSize = 20,
        public data: T[],
        initialDelete
    ) {
        this.query = new BehaviorSubject<Q>(initialQuery);
        this.sort = new BehaviorSubject<Sort<T>>(initialSort);
        this.hasDelete = new BehaviorSubject<Delete<T>>(initialDelete);
        const param$ = combineLatest([this.query, this.sort, this.hasDelete]);
        this.page$ = param$.pipe(
            switchMap(([query, sort, hasDelete]) => this.pageNumber.pipe(
                startWith(0),
                switchMap(page => this.endpoint({page, sort, size: this.pageSize}, query, hasDelete, data)
                    .pipe(indicate(this.loading))
                )
            )),
            share()
        );
    }

    sortBy(sort: Partial<Sort<T>>): void {
        const lastSort = this.sort.getValue();
        const nextSort = {...lastSort, ...sort};
        this.sort.next(nextSort);
    }

    queryBy(query: Partial<Q>): void {
        const lastQuery = this.query.getValue();
        const nextQuery = {...lastQuery, ...query};
        this.query.next(nextQuery);
    }

    delete(product: Partial<Delete<T>>): void {
        const lastProduct = this.hasDelete.getValue();
        const nextProduct = {...lastProduct, ...product};
        this.hasDelete.next(nextProduct);
    }

    fetch(page: number): void {
        this.pageNumber.next(page);
    }

    connect(): Observable<T[]> {
        return this.page$.pipe(map(page => page.content));
    }

    disconnect(): void {}
}
