import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { ServiceWorkerModule } from '@angular/service-worker';

// i18n
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ThemeConfigComponent } from './features/config/theme-config/theme-config.component';
import { SystemConfigComponent } from './features/config/system-config/system-config.component';
import { ProductConfigComponent } from './features/config/product-config/product-config.component';
import { PaymentConfigComponent } from './features/config/payment-config/payment-config.component';
import { DynamicInputsComponent } from './features/config/dynamic-inputs/dynamic-inputs.component';

Chart.register(...registerables);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ThemeConfigComponent,
    SystemConfigComponent,
    ProductConfigComponent,
    PaymentConfigComponent,
    DynamicInputsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BaseChartDirective,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader
      },
      defaultLanguage: 'en'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideTranslateHttpLoader({
      prefix: 'assets/i18n/',
      suffix: '.json'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }