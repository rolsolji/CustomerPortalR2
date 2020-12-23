import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Delete, Page, PageRequest } from "../shared/components/datasource/Page";
import { Product} from "../Entities/Product";
import { HttpService } from "./http.service";

export interface ProductQuery {
    search: string;
    registration: Date;
}

@Injectable({ providedIn: "root" })
export class ProductService {
        page(
            request: PageRequest<Product>,
            query: ProductQuery,
            hasDelete: Delete<Product>,
            products: Product[],
            httpService: HttpService
        ): Observable<Page<Product>> {
        // fake pagination, do your server request here instead
        let filteredProducts = products;
        let { search } = query;
        if (search) {
            search = search.toLowerCase();
            filteredProducts = filteredProducts.filter(
                ({ Description, Commodity, NMFC, ProductGroup, Weight }) =>
                    Description?.toLowerCase().includes(search) ||
                    Commodity?.toLowerCase().includes(search) ||
                    NMFC?.toLowerCase().includes(search) ||
                    Weight?.toString().includes(search) ||
                    ProductGroup?.toLowerCase().includes(search)
            );
        }

        const { item } = hasDelete;
        if (item) {
            httpService.DeleteProductDetails(item.ProductID).then(() => {});
            filteredProducts.splice(filteredProducts.findIndex((existingProduct) => existingProduct.ProductID === item.ProductID), 1);
        }

        filteredProducts = [...filteredProducts].sort((a, b) => {
            const propA = a[request.sort?.property]
            const propB = b[request.sort?.property]
            let result
            if (propA && propB) {
                if (typeof propA === 'string') {
                    result = propA.toLowerCase().localeCompare(propB.toString().toLowerCase())
                } else {
                    result = propA as any - (propB as any)
                }
            } else {
                result = -1;
            }
            const factor = request.sort.order == 'asc' ? 1 : -1
            return result * factor
        })
        const start = request.page * request.size;
        const end = start + request.size;
        const pageProducts = filteredProducts.slice(start, end);
        const page = {
            content: pageProducts,
            number: request.page,
            size: pageProducts.length,
            totalElements: filteredProducts.length
        };
        return of(page).pipe(delay(500));
    }
}
