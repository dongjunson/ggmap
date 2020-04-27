import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { KakaoMapsModule } from 'kakao-maps-sdk';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [ BrowserModule, KakaoMapsModule, AppRoutingModule , HttpClientModule, BrowserAnimationsModule, NgbModule],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
