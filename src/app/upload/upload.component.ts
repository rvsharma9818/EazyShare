import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  data;

  uuid;

  suc:boolean=false

  msg

  data1;

  spinner:boolean=false;


  baseurl = 'https://eazyfile-share.herokuapp.com/api/files';

  name: string;

  //reactive form for uploading images

  myForm = new FormGroup({

    myfile: new FormControl('', [Validators.required]),

  });


  constructor(private http: HttpClient) {}


  ngOnInit(): void {}


  //getting form  value   for file uploading
  get f() {

    return this.myForm.controls;

  }
  get x() {
    return this.myForm2.controls;
  }


  // handling the multipart form data
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.controls['myfile'].setValue(file);
    }
  }

 // uploading file to server
  submit() {
    const formData = new FormData();

    formData.append('myfile', this.myForm.get('myfile').value);
this.spinner=true
    this.http
      .post('https://eazyfile-share.herokuapp.com/api/files/', formData)
      .subscribe((res) => {
        setTimeout(() => {
        this.suc=true
          this.msg ="Uploaded Succesfuuly"
          this.data = res;
          this.spinner=false
          this.uuid = this.data.file.split('/').pop();
          setTimeout(()=>{
            this.suc=false

          },6000)
        }, 1000);

      });

  }




  // sendind file via email getting information


  myForm2 = new FormGroup({
    emailFrom: new FormControl('', [Validators.required,Validators.email]),
    emailTo: new FormControl('', [Validators.required,Validators.email]),
    uuid: new FormControl('', [Validators.required]),
  });

  // sending information to server to send a link

reload(){
  setTimeout(()=>{
this.data=''
  },1000*60*2)
}


  submit2() {

    this.myForm2.controls['uuid'].setValue(this.uuid);

    console.log(this.myForm2.value);

    this.http
      .post(`${this.baseurl}/send`, this.myForm2.value)
      .subscribe((res) => {
        setTimeout(() => {
          this.data1 = res;
        this.suc=true
          this.msg='Mail Succesfully Send'
          setTimeout(()=>{
            this.suc=false

          },6000)
        }, 1000);


      });
  }
cop:boolean=false

copy(){
this.cop=true
setTimeout(() => {
  this.cop=false
}, 5000);
}






  /* To copy Text from Textbox */

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  /* To copy any Text */
  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}

