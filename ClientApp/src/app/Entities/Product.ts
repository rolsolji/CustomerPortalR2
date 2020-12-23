export class Product {
    Class:         string;
    ClientID:      number;
    Commodity:     any;
    CreatedBy:     string;
    CreatedDate:   string;
    Description:   string;
    Hazmat:        boolean;
    HazmatContact: any;
    Height:        number;
    Lenght:        number;
    ModifiedBy:    string;
    ModifiedDate:  string;
    NMFC:          string;
    PackageTypeID: number;
    Pallets:       number;
    Pieces:        number;
    ProductGroup:  string;
    ProductID:     number;
    Status:        boolean;
    UserID:        number;
    Weight:        number;
    Width:         number;

    constructor(product: Product | null) {
        if (product) {
            this.Class = product.Class;
            this.ClientID = product.ClientID;
            this.Commodity = product.Commodity;
            this.CreatedBy = product.CreatedBy;
            this.CreatedDate = product.CreatedDate;
            this.Description = product.Description;
            this.Hazmat = product.Hazmat;
            this.HazmatContact = product.HazmatContact;
            this.Height = product.Height;
            this.Lenght = product.Lenght;
            this.ModifiedBy = product.ModifiedBy;
            this.ModifiedDate = product.ModifiedDate;
            this.NMFC = product.NMFC;
            this.PackageTypeID = product.PackageTypeID;
            this.Pallets = product.Pallets;
            this.Pieces = product.Pieces;
            this.ProductGroup = product.ProductGroup;
            this.ProductID = product.ProductID;
            this.Status = product.Status;
            this.UserID = product.UserID;
            this.Weight = product.Weight;
            this.Width = product.Width;
        }
    }
}
