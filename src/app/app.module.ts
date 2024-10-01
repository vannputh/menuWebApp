// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainDishesComponent } from './main-dishes/main-dishes.component';
import { SideDishesComponent } from './side-dishes/side-dishes.component';

@NgModule({
  declarations: [
    AppComponent,
    MainDishesComponent,
    SideDishesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
