import { Injectable } from '@angular/core';
import { HttpGraphQLService } from './http-graph-ql.service';
import { GraphQLTemplateService } from './graphql-template.service';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { MyQuestion } from '../models/my-question';
import { Observable } from 'rxjs';
import { GraphQLInput } from '../models/graph-qlinput';
import { Question } from '../models/question';
import { LoggingService } from './logging.service';
import { QueryParameter, Comparison } from '../models/query-parameter';
import { Status } from '../models/status';
import { DeleteQuestion } from '../models/delete-question';
import { MyTag } from '../models/my-tag';

const CREATE_OR_UPDATE_QUESTION_NAME: string = "createOrUpdateQuestion";
const GET_MY_QUESTIONS: string = "getMyQuestions";
const DELETE_QUESTION: string = "deleteQuestion";

@Injectable({
  providedIn: 'root'
})
export class QuestionRepositoryService {

  constructor(
    private http: HttpGraphQLService,
    private graphqlTemplateService: GraphQLTemplateService,
    private adalSvc: MsAdalAngular6Service,
    private logging: LoggingService
  ) { }

  private transformToQuestion(myQuestion: MyQuestion): Question {
    let question = new Question();
    question.id = myQuestion.id;
    question.owner = this.adalSvc.userInfo.userName;
    question.quizId = myQuestion.quizId;
    question.text = window.btoa(myQuestion.text);

    if (myQuestion.isV2() === false) {
      myQuestion.addV2();
    }

    question.tagsJson = JSON.stringify(myQuestion.tags).replace(new RegExp('"', 'g'), "\\\"");
    question.choicesJson = window.btoa(JSON.stringify(myQuestion.choices));
    question.explainJson = window.btoa(JSON.stringify(myQuestion.explain));
    return question;
  }

  private transformToMyQuestion(question: Question): MyQuestion {
    let myQuestion = new MyQuestion();
    myQuestion.quizId = question.quizId;
    myQuestion.id = question.id;
    
    myQuestion.tags = JSON.parse(question.tagsJson);

    if (myQuestion.isV2()) {
      myQuestion.text = window.atob(question.text);
      myQuestion.choices = JSON.parse(window.atob(question.choicesJson));
      myQuestion.explain = JSON.parse(window.atob(question.explainJson));
    } else {
      myQuestion.text = question.text;
      myQuestion.choices = JSON.parse(question.choicesJson);
      myQuestion.explain = JSON.parse(question.explainJson);
    }


    return myQuestion;
  }

  addOrUpdate(myQuestion: MyQuestion): Observable<MyQuestion> {
    let input = new GraphQLInput();

    input.operationName = "";

    input.query = this.graphqlTemplateService.convertToMutation(CREATE_OR_UPDATE_QUESTION_NAME,
      this.transformToQuestion(myQuestion), "question", null);

    input.variables = {};

    return new Observable<MyQuestion>((observable) => {

      var handleError = (err: any) => {
        this.logging.log(err);
        observable.error(err);
      };

      this.http.postAsync<Question>(CREATE_OR_UPDATE_QUESTION_NAME, input).subscribe(question => {

        observable.next(this.transformToMyQuestion(question));
        observable.complete();
      }, handleError);
    });
  }

  list(quizId: string): Observable<MyQuestion[]> {

    let queryParam = new QueryParameter();
    queryParam.name = "quizid";
    queryParam.comparison = Comparison.Equals;
    queryParam.value = quizId;

    return new Observable<MyQuestion[]>((observable) => {

      var handleError = (err: any) => {
        this.logging.log(err);
        observable.error(err);
      };

      let input = new GraphQLInput();

      input.operationName = "";
      input.query = this.graphqlTemplateService.convertToQuery(GET_MY_QUESTIONS, [queryParam],
        ["id", "text", "choicesJson", "quizId", "explainJson", "tagsJson"]);
      input.variables = {};

      this.http.postAsync<Question[]>(GET_MY_QUESTIONS, input).subscribe(list => {

        observable.next(list.map(x => this.transformToMyQuestion(x)));
        observable.complete();

      }, handleError);
    });
  }

  remove(myQuestion: MyQuestion): Observable<Status> {

    let deleteQuestion = new DeleteQuestion();
    deleteQuestion.id = myQuestion.id;
    deleteQuestion.owner = this.adalSvc.userInfo.userName;
    deleteQuestion.quizId = myQuestion.quizId;
    let input = new GraphQLInput();

    input.operationName = "";
    input.query = this.graphqlTemplateService.convertToMutation(DELETE_QUESTION, deleteQuestion, "question", ["message"]);
    input.variables = {};

    return this.http.postAsync(DELETE_QUESTION, input);

  }
}
