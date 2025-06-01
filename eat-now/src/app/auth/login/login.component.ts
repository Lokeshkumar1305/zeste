import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../../shared/services/encryption.service';
import { ApiService } from '../../common-library/services/api.service';
import { APIPath } from '../../common-library/api-enum';
import { Login } from '../../common-library/model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginObj = new Login();
  inProgressBar = false;
   showOtpScreen: boolean = false;
  hidePwd = true;
  email: any;
  encryptedPassword: any;
  otpStep!: boolean;
  password!: string;
  otp!: string;
  islogin!: boolean;
  loggedIn!: boolean;
  screen1!: boolean;
   otpval1!: string;
  otpval2!: string;
  otpval3!: string;
  otpval4!: string;
  otpval5!: string;
  otpval6!: string;
  intervalId: any;
  show!: boolean;
  formattedTime: string = '';
 
  seconds: number = 60;
interval: any;

  constructor(private router: Router, public encryptservice: EncryptionService, public postService: ApiService){  } 

   ngOnInit() {
    // this.countDown()
     this.startTimer();
  }


  localLogin(username: string, password: string) {
    this.inProgressBar = true;
    if (username == 'sadmin' && password == 'Password@123') {
      sessionStorage.setItem('tempToken', 'tou123');
      // this.postService.openSnackBar('Logged In  Successfully', 'SUCCESS');
      this.router.navigate(['/Home']);
    } else {
      this.inProgressBar = false;
      // this.reqFS = true;
    }
  }
  login(username: string, password: string) {
    if (username === 'sadmin') {
      this.localLogin(username, password);
    }
    
  }
  forgotpass(){

  }
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  /* Restricts input to numeric values only. */
  keyInputHandler(event: any) {
    const pattern = new RegExp('^[0-9]+$');
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  // DisableCut prevents the default cut action
  DisableCut(event: any) {
    event.preventDefault();
  }
  // DisableCopy prevents the default copy action
  DisableCopy(event: any) {
    event.preventDefault();
  }

  // DisablePaste prevents the default paste action
  DisablePaste(event: any) {
    event.preventDefault();
  }
  // DisableAuto prevents any default auto-processing 
  DisableAuto(event: any) {
    event.preventDefault();
  }



// validateUser() {
//   const encryptedPassword = this.encryptservice.encrypt(this.password);

//   const userValidationPayload = {
//     requestObject: {
//       emailId: this.loginObj.emailId, 
//       password: encryptedPassword
//     }
//   };
 
//   console.log('Sending payload:', userValidationPayload); 

//   this.postService.doPost(APIPath.USER_VALIDATION, userValidationPayload)
//     .subscribe((res: any) => {
//       if (res?.success && res.message.includes('otp sent')) {
//         this.postService.openSnackBar('OTP sent to your email', 'SUCCESS');

//         localStorage.setItem('email', this.loginObj.emailId);
//         localStorage.setItem('password', encryptedPassword);

//         this.router.navigate(['./auth/otp-validate']);
//       } else {
//         this.postService.openSnackBar(res.message || 'Invalid credentials', 'ERROR');
//       }
//     }, err => {
//       this.postService.openSnackBar('Validation failed. Please try again.', 'ERROR');
//     });
// }



  validateUser() {
    const encryptedPassword = this.encryptservice.encrypt(this.loginObj.password);

    const userValidationPayload = {
      requestObject: {
        emailId: this.loginObj.emailId,
        password: encryptedPassword
      }
    };

    this.inProgressBar = true;

    this.postService.doPost(APIPath.USER_VALIDATION, userValidationPayload).subscribe(
      (res: any) => {
        this.inProgressBar = false;

        if (res?.success && res.message.includes('otp sent')) {
          this.email = this.loginObj.emailId;
          localStorage.setItem('email', this.loginObj.emailId);
          localStorage.setItem('password', encryptedPassword);
          this.showOtpScreen = true;
          this.seconds = 60;
          this.startTimer();
        } else {
          this.postService.openSnackBar(res.message || 'Invalid credentials', 'ERROR');
        }
      },
      (err) => {
        this.inProgressBar = false;
        this.postService.openSnackBar('Validation failed. Please try again.', 'ERROR');
      }
    );
  }







loginWithOtp() {
  this.otp = this.otpval1 + this.otpval2 + this.otpval3 + this.otpval4 + this.otpval5 + this.otpval6;

  const encryptedPassword = this.encryptservice.encrypt(this.password);
  const encryptedOtp = this.encryptservice.encrypt(this.otp);

  const loginPayload = {
    requestObject: {
      emailId: this.email,
      password: encryptedPassword,
      otp: encryptedOtp
    }
  };

 this.postService.doPost(APIPath.USER_LOGIN, loginPayload)
  .subscribe((res: any) => {
    this.inProgressBar = false;

    if (res?.success) {
  const response = res.responseObject;
  sessionStorage.setItem('token', res.token);
  localStorage.setItem('token', res.token);
  localStorage.setItem('email', this.email); 
  localStorage.setItem('lastActive', Date.now().toString());
  localStorage.setItem('userName', response.userName);
  sessionStorage.setItem('roleTitle', JSON.stringify(response.roleTitles));

      if (res.firstTimeLogin) {
        this.islogin = false;
        this.loggedIn = true;
        this.screen1 = true;
      } else {
        this.postService.openSnackBar('Logged In Successfully', 'SUCCESS');
         this.router.navigate(['/home']);
      }

    } else {
      this.postService.openSnackBar('Invalid OTP or credentials', 'ERROR');
    }
  }, err => {
    this.inProgressBar = false;
    console.error(err);
    this.postService.openSnackBar('Login failed. Please try again.', 'ERROR');
  });

}


 movetoNext(event: any) {
    const pattern = new RegExp('^[0-9]+$');
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }
  move(e: any, p: any, c: any, n: any) {
    let lenght = c.value.length;
    let maxlength = c.getAttribute('maxlength');
    if (lenght == maxlength) {
      if (n != '') {
        n.focus();
      }
    }
    if (e.key == 'Backspace') {
      if (p != '') {
        p.focus();
      }
    }
  }

  // countDown() {
  //   this.seconds = 60;
  //   this.intervalId = setInterval(() => {
  //     if (this.seconds > 0) {
  //       this.seconds -= 1;
  //       const minutes = Math.floor(this.seconds / 60);
  //       const remainingSeconds = this.seconds % 60;
  //       this.formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  //     }
  //     else {
  //       this.clearTimer();
  //       this.show = true;
  //     }
  //   }, 1000);
  // }
  // clearTimer() {
  //   clearInterval(this.intervalId);
 
  // }


startTimer() {
  this.seconds = 60;
  this.updateFormattedTime();
  this.interval = setInterval(() => {
    this.seconds--;
    this.updateFormattedTime();
    if (this.seconds <= 0) {
      clearInterval(this.interval);
    }
  }, 1000);
}

resetTimer() {
  clearInterval(this.interval);
  this.startTimer();
}

updateFormattedTime() {
  const mins = Math.floor(this.seconds / 60);
  const secs = this.seconds % 60;
  this.formattedTime = `${mins}:${secs < 10 ? '0' + secs : secs}`;
}



}


