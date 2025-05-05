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
    email!: string;
    phoneNumber!: string;
    dateOfBirth!: string;
    gender!: string;
    aadhar!: string;
    emergencyContactNumber!: string;
    designation!: string;
    department!: string;
    dateOfJoining!: string;
    employmentType!: string;
    shiftType!: string;
    shiftStartTime!: string;
    shiftEndTime!: string;
    shiftStartDate!: string;
    shiftEndDate!: string;
    reportingManagerId!: string;
    address!: Address
    bankName!: string;
    accountNumber!: string;
    ifscCode!: string;
    salary!: number
    roles!: string;
}
