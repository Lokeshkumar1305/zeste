export class Model {
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
    address!: Address;
    constructor() {
        this.ownersList = new Array();
        this.address = new Address()
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