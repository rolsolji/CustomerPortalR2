import { DataSource } from '@angular/cdk/collections';
import {Observable} from "rxjs";

export interface DataSourceInterface<T> extends DataSource<T> {
    connect(): Observable<T[]>;
    disconnect(): void;
}
