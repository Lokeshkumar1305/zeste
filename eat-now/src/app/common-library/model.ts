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
        this.ownersList = new Array<Owners>;
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
export class Staff {
    employeeId!: string;
    firstName!: string;
    lastName!: string;
    primaryMobileNumber!: string;
    dateOfBirth!: string;
    gender!: string;
    aadhar!: string;
    emailId!: string;
    emergencyContact:EmergencyContactInfo;
    presentAddress:Address;
    permanentAddress:Address;
    additionalStaffInfo:AdditionalStaffInfo;
    bankDetails:BankDetails;
    constructor(){
        this.emergencyContact = new EmergencyContactInfo();
        this.presentAddress = new Address();
        this.permanentAddress = new Address();
        this.additionalStaffInfo = new AdditionalStaffInfo();
        this.bankDetails = new BankDetails();
    }

}
export class EmergencyContactInfo{
    firstName!: string;
    lastName!: string;
    emergencyMobileNumber!: string;
    relation!: string;
}
export class AdditionalStaffInfo{
    role!: string;
    employmentStartDate!: string;
    employmentType!: string;
    shiftType!: string;
    shiftStartDate!: string;
    shiftEndDate!: string;
    languages!: string;
}
export class BankDetails{
    bankHolderName!: string;
    bankName!: string;
    IFSCCode!: string;
    accountType!: string;
    AccountNumber!: string;
    branch!: string;
    reAccountNumber!: string;
}
export class roelDetails{
    roleTitle!: string;
    roleDescription!: string;
    privilegeId!: Array<string>;
}