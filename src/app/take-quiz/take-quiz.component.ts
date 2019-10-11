import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyQuestion } from '../models/my-question';
import { MyAnswer } from '../models/my-answer';
import { MyAnswerChoice } from '../models/my-answer-choice';
import { TakeQuizRepositoryService } from '../services/take-quiz-repository.service';
import { QuizSessionQuestion } from '../models/quiz-session-question';

@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css']
})
export class TakeQuizComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private takeQuizService: TakeQuizRepositoryService) { }

  answers: MyAnswer[];
  showResult: boolean;
  score: number;
  scorePercentage: number;
  name: string;

  getId(): string {
    return this.route.snapshot.paramMap.get('id');
  }

  sessionIndex: number = 0;

  transform(question: QuizSessionQuestion): MyAnswer {
    let answer = new MyAnswer();
    answer.question = new MyQuestion();
    answer.question.id = question.id;
    answer.question.text = question.text;
    answer.question.choices = JSON.parse(question.choicesJson);
    answer.question.explain = JSON.parse(question.explainJson);
    answer.question.tags = JSON.parse(question.tagsJson);

    answer.answers = answer.question.choices.sort(x => x.order).map((x, index) => {

      let c = new MyAnswerChoice();
      c.text = x.text;
      c.selected = false;
      c.id = index;
      return c;
    });

    return answer;
  }

  disableNext(): boolean {
    return this.sessionIndex === (this.answers.length - 1);
  }

  onChange(answer: MyAnswerChoice, myAnswer: MyAnswer): void {
    for (var i = 0; i < myAnswer.answers.length; i++) {
      var c = myAnswer.answers[i];
      c.selected = i === answer.id;
    }
  }

  disableBack(): boolean {
    return this.sessionIndex === 0;
  }

  next(): void {
    this.sessionIndex += 1;
  }

  back(): void {
    this.sessionIndex -= 1;
  }

  disableEnd(): boolean {
    return this.sessionIndex < (this.answers.length - 1);
  }

  multipleAnswers(): boolean {
    return this.answers[this.sessionIndex].question.choices.filter(c => c.isAnswer).length > 1;
  }

  end(): void {

    this.score = this.answers.filter(x => {

      var rightChoices = x.question.choices.filter((y, idx) =>
        y.isAnswer && x.answers[idx].selected ||
        !y.isAnswer && !x.answers[idx].selected).length;

      return rightChoices === x.answers.length;
    }).length;

    this.scorePercentage = this.score / this.answers.length;

    this.showResult = true;

  }

  close(): void {
    this.showResult = false;
    this.sessionIndex = 0;
    this.reload();
  }

  reload(): void {
    this.takeQuizService.get(this.getId()).subscribe(quizSession => {

      if (quizSession != null) {
        this.name = quizSession.name;
        this.answers = quizSession.questions.map(this.transform);

        if (this.answers.length === 0) {
          alert("Nothing to show because we don't have any questions.");
        }
      } else {
        this.name = "Sorry, quiz does not exist."
      }


    }, err => {
      alert(err);
    });
  }

  ngOnInit() {
    this.reload();
  }
}
