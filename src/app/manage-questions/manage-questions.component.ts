import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionRepositoryService } from '../services/question-repository.service';
import { LoggingService } from '../services/logging.service';
import { MyQuestion } from '../models/my-question';
import { MyChoice } from '../models/my-choice';
import { ExplainMyChoice } from '../models/explain-my-choice';
import { MyTag } from '../models/my-tag';
import { forkJoin } from 'rxjs';

const QUIZ_FILTER_TAG: string = "QuizFilterTag";

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
  showAddTags: boolean;

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

  private loadQuizFilterTag(question: MyQuestion): void {
    let existing = question.tags.filter(x => x.key === QUIZ_FILTER_TAG);
    if (existing.length === 1) {
      let item = existing[0];
      question.quizFilterTags = item.value.split(",");
    }
  }

  reload(): void {
    this.questionService.list(this.getId()).subscribe(list => {

      list.forEach(item => {
        this.loadQuizFilterTag(item);
      });

      this.questions = list;
    }, err => {
      alert(err);
    });
  }

  private cleanUp(text: string): string {
    text = text.replace(/"/g, "'");
    return text.replace(/(?:\r\n|\r|\n)/g, " ");
  }

  saveChanges(): void {

    this.isSaving = true;

    this.question.text = this.cleanUp(this.question.text);
    this.question.choices.forEach(c => {
      c.text = this.cleanUp(c.text);
    });

    this.questionService.addOrUpdate(this.question).subscribe(o => {

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

  selectedQuestions: MyQuestion[];
  tagValue: string;
  applyTags(): void {

    this.selectedQuestions = this.questions.filter(x => x.selected === true);
    if (this.selectedQuestions.length > 0) {
      this.tagValue = "";
      this.showAddTags = true;
    } else {
      alert("Select the questions you want to tag.");
    }
  }

  saveTagChanges(): void {
    this.isSaving = true;

    var all = this.selectedQuestions.map((question) => {

      let myTag: MyTag = null;

      let existing = question.tags.filter(x => x.key === QUIZ_FILTER_TAG);
      if (existing.length === 1) {
        myTag = existing[0];
        myTag.value += "," + this.tagValue;
      }
      else {
        myTag = new MyTag();
        myTag.key = QUIZ_FILTER_TAG;
        myTag.value = this.tagValue;
        question.tags.push(myTag);
      }

      return this.questionService.addOrUpdate(question);
    });


    forkJoin(all).subscribe((questions: MyQuestion[]) => {
      this.isSaving = false;
      this.showAddTags = false;

      this.newQuestion();
      this.reload();
    }, err => {
      alert(err);
    });
  }

  removeTag(label: string, question: MyQuestion): void {
    let existing = question.tags.filter(x => x.key === QUIZ_FILTER_TAG);
    if (existing.length === 1) {
      let item = existing[0];
      item.value = item.value.split(",").filter(x => x !== label).join(",");

      this.questionService.addOrUpdate(question).subscribe(o => {
        this.newQuestion();
        this.reload();
      }, err => {
        alert(err);
      })
    }
  }
}
