import { Injectable } from '@angular/core';
import { HttpGraphQLService } from './http-graph-ql.service';
import { MyQuiz } from '../models/my-quiz';
import { Observable } from 'rxjs';
import { GraphQLInput } from '../models/graph-qlinput';
import { GraphQLTemplateService } from './graphql-template.service';
import { Status } from '../models/status';
import { DeleteQuiz } from '../models/delete-quiz';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

const CREATE_QUIZ_NAME: string = "createOrUpdateMyQuiz";
const GET_ALL_MY_QUIZES: string = "getAllMyQuizes";
const DELETE_QUIZ: string = "deleteMyQuiz";

@Injectable({
  providedIn: 'root'
})
export class QuizRepositoryService {

  constructor(
    private http: HttpGraphQLService,
    private graphqlTemplateService: GraphQLTemplateService,
    private adalSvc: MsAdalAngular6Service) { }

  add(quiz: MyQuiz): Observable<MyQuiz> {

    let input = new GraphQLInput();

    input.operationName = "";
    input.query = this.graphqlTemplateService.convertToMutation(CREATE_QUIZ_NAME, quiz, "myquiz", null);
    input.variables = {};

    return this.http.postAsync(CREATE_QUIZ_NAME, input);
  }

  list(): Observable<MyQuiz[]> {
    let input = new GraphQLInput();

    input.operationName = "";
    input.query = this.graphqlTemplateService.convertToQuery(GET_ALL_MY_QUIZES, null, ["id", "name", "isPublic"]);
    input.variables = {};

    return this.http.postAsync(GET_ALL_MY_QUIZES, input);
  }

  remove(quiz: MyQuiz): Observable<Status> {

    let deleteQuiz = new DeleteQuiz();
    deleteQuiz.id = quiz.id;
    deleteQuiz.owner = this.adalSvc.userInfo.userName;

    let input = new GraphQLInput();

    input.operationName = "";
    input.query = this.graphqlTemplateService.convertToMutation(DELETE_QUIZ, deleteQuiz, "myquiz", ["message"]);
    input.variables = {};

    return this.http.postAsync(DELETE_QUIZ, input);

  }
}
