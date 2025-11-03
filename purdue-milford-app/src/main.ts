import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { iconService } from './app/icon.service';

bootstrapApplication(AppComponent, appConfig)
  // .then((appRef) => {
  //   // Initialize icons after app bootstrap
  //   const icons = appRef.injector.get(iconService);
  //   icons.registerIcons();
  // })
  .catch((err) => console.error(err));
