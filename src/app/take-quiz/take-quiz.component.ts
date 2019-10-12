import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyQuestion } from '../models/my-question';
import { MyAnswer } from '../models/my-answer';
import { MyAnswerChoice } from '../models/my-answer-choice';
import { TakeQuizRepositoryService } from '../services/take-quiz-repository.service';
import { QuizSessionQuestion } from '../models/quiz-session-question';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { QuestionRepositoryService } from '../services/question-repository.service';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css']
})
export class TakeQuizComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private takeQuizService: TakeQuizRepositoryService,
    private adalSvc: MsAdalAngular6Service,
    private questionRepositoryService: QuestionRepositoryService,
    private router: Router) { }

  answers: MyAnswer[];
  showResult: boolean;
  score: number;
  scorePercentage: number;
  name: string;
  reviewMode: boolean = false;

  getId(): string {
    return this.route.snapshot.paramMap.get('id');
  }

  private isLoggedIn(): boolean {
    return this.adalSvc.userInfo && this.adalSvc.userInfo != null;
  }

  sessionIndex: number = 0;

  private populateAnswers(answer: MyAnswer): void {
    answer.answers = answer.question.choices.sort(x => x.order).map((x, index) => {

      let c = new MyAnswerChoice();
      c.text = x.text;
      c.selected = false;
      c.id = index;
      c.isAnswer = x.isAnswer === true;
      return c;
    });

    shuffleArray(answer.answers);
  }

  private transformQuizSessionQuestion(question: QuizSessionQuestion): MyAnswer {
    let answer = new MyAnswer();
    answer.question = new MyQuestion();
    answer.question.id = question.id;
    answer.question.text = question.text;
    answer.question.choices = JSON.parse(question.choicesJson);
    answer.question.explain = JSON.parse(question.explainJson);
    answer.question.tags = JSON.parse(question.tagsJson);

    this.populateAnswers(answer);
    return answer;
  }

  private transformMyQuestion(question: MyQuestion): MyAnswer {
    let answer = new MyAnswer();
    answer.question = question;
    this.populateAnswers(answer);
    return answer;
  }

  disableNext(): boolean {
    return this.answers && this.sessionIndex === (this.answers.length - 1);
  }

  _answer: MyAnswerChoice = null;
  _myAnswer: MyAnswer = null;

  onChange(answer: MyAnswerChoice, myAnswer: MyAnswer): void {

    this._answer = answer;
    this._myAnswer = myAnswer;
  }

  disableBack(): boolean {
    return this.sessionIndex === 0;
  }

  setAnswer(): void {
    if (this._answer !== null) {
      for (var i = 0; i < this._myAnswer.answers.length; i++) {
        var c = this._myAnswer.answers[i];
        c.selected = false;
      }
      this._answer.selected = true;
      this._myAnswer = null;
      this._answer = null;
    }
  }

  next(): void {
    this.setAnswer();
    this.sessionIndex += 1;
  }

  back(): void {
    this.setAnswer();
    this.sessionIndex -= 1;
  }

  disableEnd(): boolean {
    return this.reviewMode === false && this.answers && this.sessionIndex < (this.answers.length - 1);
  }

  multipleAnswers(): boolean {
    return this.answers[this.sessionIndex].question.choices.filter(c => c.isAnswer).length > 1;
  }

  isReviewMode(): boolean {
    return this.reviewMode;
  }

  shouldShowAnswerAsRight(myAns: MyAnswerChoice): boolean {
    return this.isReviewMode() && myAns.isAnswer === true;
  }

  shouldShowAnswerAsWrong(myAns: MyAnswerChoice, myAnswers: MyAnswerChoice[]): boolean {

    if (myAnswers) {
      var isCheckBox = myAnswers.filter(x => x.isAnswer).length > 1;
      if (isCheckBox) {
        return this.isReviewMode() && myAns.isAnswer === false && myAns.selected === true;
      }
    }

    return this.isReviewMode() && myAns.isAnswer === false && myAns.selected === true;
  }

  end(): void {

    this.score = this.answers.filter(x => {

      var rightAnswers = x.answers.filter((a) => {
        return a.isAnswer === a.selected;
      }).length;

      return rightAnswers === x.answers.length
    }).length;

    this.scorePercentage = this.score / this.answers.length;

    this.showResult = true;

  }

  closeAndEnableReviewMode(): void {
    this.showResult = false;
    this.sessionIndex = 0;
    this.reviewMode = true;
  }

  close(): void {
    this.reviewMode = false;
    this.showResult = false;
    this.sessionIndex = 0;
    this.reload();
  }

  private errorHandler = (err: any) => {
    alert(err);
  };

  private secureReload(): void {
    this.questionRepositoryService.list(this.getId()).subscribe(quiz => {
      this.name = localStorage.getItem("quizName");
      this.answers = quiz.map(q => this.transformMyQuestion(q));
      if (this.answers.length == 0) {
        alert("Nothing to show because we don't have any questions.");
        this.router.navigateByUrl("/");
        return;
      }

      shuffleArray(this.answers);

    }, this.errorHandler);
  }

  private publicReload(): void {
    this.takeQuizService.get(this.getId()).subscribe(quizSession => {

      if (quizSession != null) {
        this.name = quizSession.name;
        this.answers = quizSession.questions.map(q => this.transformQuizSessionQuestion(q));

        if (this.answers.length === 0) {
          alert("Nothing to show because we don't have any questions.");
          return;
        }
      } else {
        this.name = "Sorry, quiz does not exist."
        return;
      }

      shuffleArray(this.answers);

    }, this.errorHandler);
  }

  reload(): void {

    if (this.isLoggedIn()) {
      this.secureReload();
    } else {
      this.publicReload();
    }
  }

  enableReviewMode(): void {
    this.reviewMode = true;
  }

  disableReviewMode(): void {
    this.reviewMode = false;
  }

  ngOnInit() {
    this.reload();
  }
}
