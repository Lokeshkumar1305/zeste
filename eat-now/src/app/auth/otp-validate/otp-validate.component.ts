import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../../shared/services/encryption.service';
import { ApiService } from '../../common-library/services/api.service';
import { APIPath } from '../../common-library/api-enum';
import { Login } from '../../common-library/model';

@Component({
  selector: 'app-otp-validate',
  templateUrl: './otp-validate.component.html',
  styleUrl: './otp-validate.component.scss'
})
export class OtpValidateComponent {
 otpval1!: string;
  otpval2!: string;
  otpval3!: string;
  otpval4!: string;
  otpval5!: string;
  otpval6!: string;
  loginObj = new Login();
  intervalId: any;
  show!: boolean;
  formattedTime: string = '';
  email: string = '';
  seconds: number = 60;
interval: any;
  constructor( private router: Router, public encryptservice: EncryptionService, public postService: ApiService
    ) {
 
  }
  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
    this.countDown()
     this.startTimer();
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
 


submitOtp() {
  const otpCode = this.otpval1 + this.otpval2 + this.otpval3 + this.otpval4 + this.otpval5 + this.otpval6;
  const emailId = localStorage.getItem('email');

  const userLoginPayload = {
    requestObject: {
      emailId: emailId, 
      otp: otpCode
    }
  };

  console.log('Sending login payload:', userLoginPayload); 

  this.postService.doPost(APIPath.USER_LOGIN, userLoginPayload)
    .subscribe((res: any) => {
      if (res?.success) {
        this.otpSuccess();
        localStorage.removeItem('email');
        this.postService.openSnackBar(res.message || 'Login Successful', 'SUCCESS');
      } else {
        this.postService.openSnackBar(res.message || 'OTP verification failed', 'ERROR');
      }
    }, err => {
      this.postService.openSnackBar('Login failed. Please try again.', 'ERROR');
    });
}




  countDown() {
    this.seconds = 60;
    this.intervalId = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds -= 1;
        const minutes = Math.floor(this.seconds / 60);
        const remainingSeconds = this.seconds % 60;
        this.formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      }
      else {
        this.clearTimer();
        this.show = true;
      }
    }, 1000);
  }
  clearTimer() {
    clearInterval(this.intervalId);
 
  }


//   resendOtp() {
//   const url = APIPath.RESEND_OTP;
//   const email = localStorage.getItem('email');

//   const obj = {
//     requestObject: {
//       email: email
//     }
//   };

//   this.http.post(url, obj).subscribe((res: any) => {
//     console.log(res);
//     if (res.success) {
//       this.snackbar.open('OTP resent successfully', 'Dismiss', { duration: 3000 });
//       this.resetTimer(); // restart countdown
//     } else {
//       this.snackbar.open('Failed to resend OTP', 'Dismiss', { duration: 3000 });
//     }
//   }, err => {
//     console.error(err);
//     this.snackbar.open('Error while resending OTP', 'Dismiss', { duration: 3000 });
//   });
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
  
  // close() {
  //   this.dialogRef.close();
  // }

  otpSuccess(){
     this.router.navigate(['./home']);
  }
}
