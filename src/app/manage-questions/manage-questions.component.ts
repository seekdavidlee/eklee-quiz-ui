import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionRepositoryService } from '../services/question-repository.service';
import { LoggingService } from '../services/logging.service';
import { MyQuestion } from '../models/my-question';
import { MyChoice } from '../models/my-choice';
import { ExplainMyChoice } from '../models/explain-my-choice';

@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.css']
})
export class ManageQuestionsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionRepositoryService,
    private logger: LoggingService) { }

  showAdd: boolean;
  isSaving: boolean;
  question: MyQuestion;
  questions: MyQuestion[];

  ngOnInit() {
    this.newQuestion();
    this.reload();
  }

  add(): void {
    this.newQuestion();
    this.showAdd = true;
  }

  newQuestion(): void {
    this.question = new MyQuestion();
    this.question.id = "@";
    this.question.explain = new ExplainMyChoice();
    this.question.quizId = this.getId();
    this.question.tags = [];

    var choice = new MyChoice();
    choice.text = "";
    choice.order = 0;
    this.question.choices = [choice];
  }

  getId(): string {
    return this.route.snapshot.paramMap.get('id');
  }

  reload(): void {
    this.questionService.list(this.getId()).subscribe(list => {
      this.questions = list;
    }, err => {
      alert(err);
    });
  }
  saveChanges(): void {

    this.isSaving = true;

    this.questionService.add(this.question).subscribe(o => {

      this.logger.logObject(o);

      this.isSaving = false;
      this.showAdd = false;

      this.newQuestion();
      this.reload();

    }, err => {

      this.isSaving = false;

      alert(err);
    });
  }

  edit(question: MyQuestion): void {
    this.question = question;
    this.showAdd = true;
  }

  remove(question: MyQuestion): void {
    this.questionService.remove(question).subscribe(status => {
      alert(status.message);
      this.reload();
    }, err => {
      alert(err);
    });
  }

  addChoice(question: MyQuestion): void {
    if (!question.choices) {
      question.choices = [];
    }

    var choice = new MyChoice();
    choice.order = question.choices.length + 1;
    choice.text = "";
    question.choices.push(choice);
  }

  removeChoice(question: MyQuestion, choice: MyChoice): void {
    question.choices = question.choices.filter(c => c.order !== choice.order);
  }
}
