import { Component, HostListener } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Plugins } from '@capacitor/core';
import { SwUpdate } from '@angular/service-worker';
import { Router } from '@angular/router';

const { Storage, Share, Clipboard } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  darkMode: boolean;
  updateAvailable: boolean;
  deferredPrompt: any;

  constructor(
    public auth: AuthService,
    private platform: Platform,
    private toaster: ToastController,
    private swUpdates: SwUpdate,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // TODO: handle splash screen & status bar
    });

    Storage.get({ key: 'darkMode' }).then(({ value }) => {
      if (value) {
        this.darkMode = true;
        document.body.classList.add('dark');
      }
    });

    this.swUpdates.available.subscribe(async event => {
      this.updateAvailable = true;
    });

    this.router.events.subscribe(async () => {
      if (this.updateAvailable) {
        await this.swUpdates.activateUpdate();
        document.location.reload();
      }
    });
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    e.preventDefault();
    this.deferredPrompt = e;
  }

  async installPWA() {
    this.deferredPrompt.prompt();

    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      this.deferredPrompt = null;
    }
  }

  async toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    if (isDark) {
      await Storage.set({ key: 'darkMode', value: 'enabled' });
    } else {
      await Storage.remove({ key: 'darkMode' });
    }
  }

  async share() {
    try {
      await Share.share({
        title: 'The Art of Cooking Salmon',
        text: 'Beautiful & tasty, Lets Eat! Share your Salmon at The Art of Cooking Salmon .com! ',
        url: 'http://theartofcookingsalmon.com/',
        dialogTitle: 'Share'
      });
    } catch (e) {
      // desktop
      await Clipboard.write({
        string: 'https://theartofcookingsalmon.com'
      });
      const toast = await this.toaster.create({
        message: 'Link Copied :)',
        duration: 2345,
        position: 'top'
      });
      toast.present();
    }
  }

}
