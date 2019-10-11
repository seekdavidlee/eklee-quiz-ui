import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageQuizesComponent } from './manage-quizes/manage-quizes.component';
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { ManageQuestionsComponent } from './manage-questions/manage-questions.component';
import { TakeQuizComponent } from './take-quiz/take-quiz.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthenticationGuard] },
  { path: 'quizes', component: ManageQuizesComponent, pathMatch: 'full', canActivate: [AuthenticationGuard] },
  { path: 'questions/:id', component: ManageQuestionsComponent, pathMatch: 'full', canActivate: [AuthenticationGuard] },
  { path: 'take/quiz/:id', component: TakeQuizComponent, pathMatch: 'full' }
];

@NgModule({
  providers: [AuthenticationGuard],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
