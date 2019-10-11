import { Component, OnInit } from '@angular/core';
import { LoggingService } from '../services/logging.service';
import { QuizRepositoryService } from '../services/quiz-repository.service';
import { MyQuiz } from '../models/my-quiz';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private quizService: QuizRepositoryService,
    private router: Router,
    private logger: LoggingService) { }

  quizes: MyQuiz[];

  ngOnInit() {
    this.quizService.list().subscribe(list => {
      this.quizes = list;
    }, err => {
      this.logger.log(err);
      alert(err);
    });
  }

  start(quiz: MyQuiz): void {
    localStorage.setItem("quizName", quiz.name);
    this.router.navigateByUrl("/take/quiz/" + quiz.id);
  }
}
