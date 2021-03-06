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
import { MatSnackBar } from "@angular/material/snack-bar";
import {AuthenticationService} from "../../../../common/authentication.service";

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
  clientID: number;
  productGroupType: ProductGroup[];
  
  // productClasses = [50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500, '']
  productClasses = [{ classes: "50", Effectiveclass: "50" },
                    { classes: "55", Effectiveclass: "55" },
                    { classes: "60", Effectiveclass: "60" },
                    { classes: "65", Effectiveclass: "65" },
                    { classes: "70", Effectiveclass: "70" },
                    { classes: "77.5", Effectiveclass: "77" },
                    { classes: "85", Effectiveclass: "85" },
                    { classes: "92.5", Effectiveclass: "92" },
                    { classes: "100", Effectiveclass: "100" },
                    { classes: "110", Effectiveclass: "110" },
                    { classes: "125", Effectiveclass: "125" },
                    { classes: "150", Effectiveclass: "150" },
                    { classes: "175", Effectiveclass: "175" },
                    { classes: "200", Effectiveclass: "200" },
                    { classes: "250", Effectiveclass: "250" },
                    { classes: "300", Effectiveclass: "300" },
                    { classes: "400", Effectiveclass: "400" },
                    { classes: "500", Effectiveclass: "500" },
                    { classes: "", Effectiveclass: "" }]

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icPhone = icPhone;

  constructor(
      @Inject(MAT_DIALOG_DATA) public defaults: any,
      private dialogRef: MatDialogRef<ProductCreateUpdateComponent>,
      private fb: FormBuilder,
      private httpService: HttpService,
      private snackBar: MatSnackBar,
      private au: AuthenticationService
  ) {}

  async ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Product;
    }

    this.user = this.httpService.getUserFromStorage();
    this.clientID = this.au.getDefaultClient().ClientID;
    this.productGroupType = await this.httpService.GetProductGroupType(this.clientID);

    this.form = this.fb.group({
      Description: this.defaults?.Description,
      Weight: this.defaults?.Weight,
      Pallets: this.defaults?.Pallets,
      Pieces: this.defaults?.Pieces,
      NMFC: this.defaults?.NMFC,
      Lenght: this.defaults?.Lenght,
      Class: this.defaults?.Class ?? '50',
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
      this.createProduct();
    } else if (this.mode === 'update') {
      this.updateProduct();
    }
  }

  createProduct() {
    const product = this.parseCreateProduct();
    this.httpService.InsertProductDetails(product).then(() => {
      this.snackBar.open('Product added', null, {
        duration: 5000
      });
      this.dialogRef.close(product);
    });
  }

  updateProduct() {
    const product = this.parseUpdateProduct();
    this.httpService.UpdateProductDetails(product).then(() => {
      this.snackBar.open('Product modified', null, {
        duration: 5000
      });
      this.dialogRef.close(product);
    });
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

    product.ClientID = this.clientID;
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

    let productGroupType = this.productGroupType.find((item) => item.GroupCode === "STD");    
    try{
      product.ProductGroupID = productGroupType?.ProductGroupID;
    }catch{
      product.ProductGroupID = 0
    }
    
    return product
  }
}
