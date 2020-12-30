import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPerson from '@iconify/icons-ic/twotone-person';
import { Product } from "../../../../Entities/Product";
import { User } from "../../../../Entities/user.model";
import { HttpService } from "../../../../common/http.service";
import { ProductGroup } from "../../../../Entities/ProductGroup";
import { String } from "typescript-string-operations";

@Component({
  selector: 'vex-product-create-update',
  templateUrl: './product-create-update.component.html',
  styleUrls: ['./product-create-update.component.scss']
})
export class ProductCreateUpdateComponent implements OnInit {

  static id = 100;

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  hazmat: boolean = false;
  active: boolean = false;
  approved: number = 1;
  user: User;
  productGroupType: ProductGroup[];
  productClasses = [50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500, '']

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icPhone = icPhone;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<ProductCreateUpdateComponent>,
              private fb: FormBuilder,
              private httpService: HttpService) {
  }

  async ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Product;
    }

    this.user = this.httpService.getUserFromStorage();
    this.productGroupType = await this.httpService.GetProductGroupType(this.user.ClientID);

    this.form = this.fb.group({
      Description: this.defaults?.Description,
      Weight: this.defaults?.Weight,
      Pallets: this.defaults?.Pallets,
      Pieces: this.defaults?.Pieces,
      NMFC: this.defaults?.NMFC,
      Lenght: this.defaults?.Lenght,
      Class: this.defaults?.Class ?? '',
      Height: this.defaults?.Height,
      Commodity: this.defaults?.Commodity,
      Width: this.defaults?.Width,
      HazmatContact: this.defaults?.HazmatContact,
    });
    this.active = this.defaults?.Status ?? true;
    this.approved = this.defaults?.IsApprove ?? 1;
    this.hazmat = this.defaults?.Hazmat ?? false;
  }

  save() {
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }

  createCustomer() {
    const product = this.parseCreateProduct();
    this.httpService.InsertProductDetails(product).then(() => this.dialogRef.close(product));
  }

  updateCustomer() {
    const product = this.parseUpdateProduct();
    this.httpService.UpdateProductDetails(product).then(() => this.dialogRef.close(product));
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  parseUpdateProduct() {
    const product = this.parseProduct();

    product.ProductID = this.defaults.ProductID;
    product.ClientID = this.defaults.ClientID;
    product.CreatedBy = this.defaults.CreatedBy;
    product.CreatedDate = this.defaults.CreatedDate;
    product.PackageTypeID = this.defaults.PackageTypeID;
    product.UserId = this.user.UserID;

    return product;
  }

  parseCreateProduct() {
    const product = this.parseProduct();
    const currentTime = new Date();

    product.ClientID = this.user.ClientID;
    product.CreatedBy = this.user.UserName;
    product.CreatedDate = String.Format('/Date({0})/', currentTime.getTime());

    return product;
  }

  parseProduct() {
    const product = this.form.value;
    const currentTime = new Date();

    product.Status = this.active;
    product.IsApprove = this.approved;
    product.Hazmat = this.hazmat;
    product.ModifiedBy = this.user.UserName;
    product.ModifiedDate = String.Format('/Date({0})/', currentTime.getTime());
    product.ProductGroup = this.defaults.ProductGroup ?? 'STANDARD';

    const productGroupType = this.productGroupType.find((item) => item.Description === product.ProductGroup);
    product.ProductGroupID = productGroupType.ProductGroupID;

    return product
  }
}
