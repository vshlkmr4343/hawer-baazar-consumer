import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FcmService } from '../app/fcm.service';
@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss']
})

export class AppComponent {
	notificationData: any;
	hasOnTab: boolean = false;
	hasOnTabForGround: boolean = false;
	isNotOpen: boolean = true;
	subscription: any;

	constructor(
		private nativeAudio: NativeAudio,
		private oneSignal: OneSignal,
		private filePath: FilePath,
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		public toast: ToastController,
		private alert: AlertController,
		private network: Network,
		private iap: InAppBrowser,
		private fcm: FcmService,
	) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.setupPush();
			if (this.network.type != 'none') {
				this.fcm.presentLoading('show')
				this.fcm.getId().then(token => {
					// let body = { 'pushToken': '' }
					// body.pushToken = token.pushToken;
					console.log("Token is", token.userId)
					let count = 0;
					const browser = this.iap.create("https://hawkerbazaar.com/consumer/#/?deviceToken=" + token.userId + "&deviceType=1", "_self", "hideurlbar=yes,closebuttoncolor=white,toolbar=yes,location=no,zoom=no");
					// const browser = this.iap.create("https://codewarriortechnologies.com/works/hawkerbazaar/#/?deviceToken=" + token.userId + "&deviceType=1", "_blank", "hideurlbar=yes,closebuttoncolor=white,toolbar=yes,location=no,zoom=no");
					browser.on('loadstop').subscribe(event => {
						//console.log('loadstop:', event)
						if (event.url == "https://hawkerbazaar.com/consumer/#/?deviceToken=" + token.userId + "&deviceType=1" || event.url == "https://hawkerbazaar.com/consumer/#/sign-in?deviceToken=" + token.userId + "&deviceType=1" || event.url == "https://hawkerbazaar.com/consumer/#/search")
						//console.log("event url", event.url)
						// if (event.url == "https://codewarriortechnologies.com/works/hawkerbazaar/#/?deviceToken=" + token.userId + "&deviceType=1" || event.url == "https://codewarriortechnologies.com/works/hawkerbazaar/#/search") 
						{
							count = count + 1;
							if (count == 2) {
							}
							if (count == 4) {
								navigator['app'].exitApp()
							}
						}
					});
					browser.on('exit').subscribe(function (event) {
						console.log('Exit event', event);
						navigator['app'].exitApp();
					});
				});
			}
			else {
				this.presentAlert();
			}
		});

	}

	setupPush() {
		this.oneSignal.startInit('d3eb89cb-a549-4c46-83ea-a66c63592073', '421945239645');
		this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
		this.oneSignal.handleNotificationReceived().subscribe((data) => {
			console.log('DATA:', JSON.stringify(data))
			//this.playRingtone()
			//this.playAudio();
		});

		this.oneSignal.handleNotificationOpened().subscribe((data) => {
			console.log("data>>>>>>>", data)
			// this.playAudio();
			const browser1 = this.iap.create("https://hawkerbazaar.com/consumer/#/notification", "_self", "hideurlbar=yes,closebuttoncolor=white,toolbar=yes,location=no,zoom=no");
			// const browser1 = this.iap.create("https://codewarriortechnologies.com/works/hawkerbazaar/#/notification", "_self", "hideurlbar=yes,closebuttoncolor=white,toolbar=yes,location=no,zoom=no");
			browser1.on('exit').subscribe(function (event) {
				console.log('Exit event', event);
				navigator['app'].exitApp();
			});
		});

		this.oneSignal.endInit();


	}

	playAudio() {
		let id = JSON.stringify(Math.floor(1000 + Math.random() * 9000));
		console.log('id', id);
		this.nativeAudio.preloadSimple(id, 'assets/sound/alarm.mp3').then(data => {
			this.nativeAudio.play(id, () => console.log('uniqueId1 is done playing'));
		});

	}
	async presentAlert() {
		const alert = await this.alert.create({
			header: "",
			subHeader: 'Please check your internet connection.',
			message: '',
			buttons: [{
				text: 'ok',
				role: 'ok',
				handler: () => {
					navigator['app'].exitApp();
				}
			}]
		});
		await alert.present();
	}

}
//Firebase Server key:: AAAAYj3laF0:APA91bHjm_AXqu4f5hP6J2k3VdL8MMmujXuE4dlbKFZM8wY5ry2ohQiMW0-A9F6CwjDXboWkmtHSwDXU_hCw2vJzWtwkcE6LGamXVztkAnB4prmfISIAypZStOERjAmvCMsC_gNLT1yV

//Firebase Sender Id :421945239645

//Onesignal App ID: d3eb89cb-a549-4c46-83ea-a66c63592073

//Rest Api : MTE0NTdhOTMtMWY2Zi00NTVmLWE0OWQtMWM0MDI3MjEwYzdl

//Google FireBase 
//Email::hawkerbazaaronesignal@gmail.com
//Password::1qaz2wsx#@

// For Genarate KeyStore:: keytool -genkey -v -keystore consumer.keystore -alias consumer -keyalg RSA -keysize 2048 -validity 10000

//keyStore Password :: vishalscrum#
//jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore consumer.keystore app-release-unsigned.apk consumer
// /Users/apple/Library/Android/sdk/build-tools/28.0.3/zipalign -v 4 app-release-unsigned.apk Consumer.apk