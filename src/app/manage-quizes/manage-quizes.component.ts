import { Component, OnInit } from '@angular/core';
import { MyQuiz } from '../models/my-quiz';
import { QuizRepositoryService } from '../services/quiz-repository.service';
import { LoggingService } from '../services/logging.service';

@Component({
  selector: 'app-manage-quizes',
  templateUrl: './manage-quizes.component.html',
  styleUrls: ['./manage-quizes.component.css']
})
export class ManageQuizesComponent implements OnInit {

  constructor(private quizService: QuizRepositoryService, private logger: LoggingService) { }

  showAddQuiz: boolean;
  isSaving: boolean;
  quiz: MyQuiz;
  quizes: MyQuiz[];

  ngOnInit() {
    this.newQuiz();
    this.reload();
  }

  reload(): void {
    this.quizService.list().subscribe(list => {
      this.quizes = list;
    }, err => {
      alert(err);
    });
  }

  addQuiz(): void {
    this.newQuiz();
    this.showAddQuiz = true;
  }

  newQuiz(): void {
    this.quiz = new MyQuiz();
    this.quiz.id = "@";
    this.quiz.name = "";
  }

  saveChanges(): void {

    this.isSaving = true;

    this.quizService.add(this.quiz).subscribe(o => {

      this.logger.logObject(o);

      this.isSaving = false;
      this.showAddQuiz = false;

      this.newQuiz();
      this.reload();

    }, err => {

      this.isSaving = false;

      alert(err);
    });
  }

  edit(quiz: MyQuiz) {
    this.quiz = quiz;
    this.showAddQuiz = true;
  }

  remove(quiz: MyQuiz) {
    this.quizService.remove(quiz).subscribe(status => {
      alert(status.message);
      this.reload();
    }, err => {
      alert(err);
    });
  }
}
