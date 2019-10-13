import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MsAdalAngular6Module } from 'microsoft-adal-angular6';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageQuizesComponent } from './manage-quizes/manage-quizes.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ManageQuestionsComponent } from './manage-questions/manage-questions.component';
import { TakeQuizComponent } from './take-quiz/take-quiz.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    ManageQuizesComponent,
    ManageQuestionsComponent,
    TakeQuizComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsAdalAngular6Module.forRoot(environment.adalConfig),
    HttpClientModule,
    FormsModule, 
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
