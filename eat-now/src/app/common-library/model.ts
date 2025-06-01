export class Login{
  emailId!: string;
  password!: string;
}
export class ENbreadcrumb {
    name!: string;
    link!: string;
}
export class Outlet {
    outletName!: string;
    outletType!: string;
    gstNumber!: string;
    fssaiNumber!: string;
    outletRegistrationType!: string;
    ownersList!: Array<Owners>;
    baseAddress!: Address;
    constructor() {
        this.ownersList = new Array<Owners>;
        this.baseAddress = new Address()
    }

}
export class Owners {
    firstName!: string;
    lastName!: string;
    dateOfBirth!: string;
    gender!: string;
    email!: string;
    mobileNumber!: string;
    aadhar!: string;
    panNumber!: string;
}
export class Address {
    addressLine1!: string;
    addressLine2!: string;
    city!: string;
    state!: string;
    pinCode!: string;
    country!: string;
}
export class Staff {
    employeeId!: string;
    firstName!: string;
    lastName!: string;
    primaryMobileNumber!: string;
    dateOfBirth!: string;
    gender!: string;
    aadhar!: string;
    emailId!: string;
    emergencyContact: EmergencyContactInfo;
    presentAddress: Address;
    permanentAddress: Address;
    additionalStaffInfo: AdditionalStaffInfo;
    bankDetails: BankDetails;
    constructor() {
        this.emergencyContact = new EmergencyContactInfo();
        this.presentAddress = new Address();
        this.permanentAddress = new Address();
        this.additionalStaffInfo = new AdditionalStaffInfo();
        this.bankDetails = new BankDetails();
    }

}
export class EmergencyContactInfo {
    firstName!: string;
    lastName!: string;
    emergencyMobileNumber!: string;
    relation!: string;
}
export class AdditionalStaffInfo {
    role!: string;
    employmentStartDate!: string;
    employmentType!: string;
    shiftType!: string;
    shiftStartDate!: string;
    shiftEndDate!: string;
    languages!: string;
}
export class BankDetails {
    bankHolderName!: string;
    bankName!: string;
    IFSCCode!: string;
    accountType!: string;
    AccountNumber!: string;
    branch!: string;
    reAccountNumber!: string;
}
export class roelDetails {
    roleTitle!: string;
    roleDescription!: string;
    privilegeId!: Array<string>;
}
export class Table {
    area!: string;
    tableCapacity!: string;
    tableCode!: string;
    status!: string;
}

export class Variation {
    variationName!: string;
    price!: number;
  }

  export class Category {
    categoryName!: string;
    menuItems!: Menu[];
  }

  export class Menu {
    id!:string;
    itemName!: string;
    itemType!: string;
    availability!: string;
    preparationTime!: number;
    description!: string;
    price!: number;
    hasVariation!: boolean;
    variations!: Variation[];
    spiceLevel!: string;
    isRecommended!: boolean;
    isCustomizable!: boolean;
    image!: string;
    category: Category;
    variation: Variation;
    status!:string;
    constructor() {
        this.category = new Category();
        this.variation = new Variation();
    }
  }

   export class Categories {
    id!:string;
    categoryName!: string;
    description!: string;
    outletId!: string;
    image!: string;
    status!:string;
   }
export class Area {
    area_name!: string;
    noOfTables!: string
}
export class Orders {
    itemName!: string;
    brand!: string;
    category!: string;
    quantity!: string;
    supplierName!: string;
    prefferedSupplier!: string;


}