import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer/ngx';


@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
  private form : FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private emailComposer: EmailComposer,
    private formBuilder: FormBuilder) {
      this.form = this.formBuilder.group({
        rating: ['', Validators.required], //, Validators.required
        description: [''],
        recommend: ['', Validators.required]
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  logForm(){
    console.log(this.form.value)


    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        // Send a text message using default options
        this.emailComposer.open(email);
      }
     });

     let email = {
       to: 'mobileup-service@uni-potsdam.de',
       attachments: [
       ],
       subject: 'Mobile.UP - Feedback',
       body: 'Overall rating:'+this.form.value.rating+'Comment:'+this.form.value.description+'Recommendation: '+this.form.value.recommend,
       isHtml: true
     }


  }
}
