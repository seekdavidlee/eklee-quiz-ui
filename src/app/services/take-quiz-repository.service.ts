import { Injectable } from '@angular/core';
import { HttpGraphQLService } from './http-graph-ql.service';
import { GraphQLTemplateService } from './graphql-template.service';
import { Observable } from 'rxjs';
import { QuizSession } from '../models/quiz-session';
import { GraphQLInput } from '../models/graph-qlinput';
import { QueryParameter, Comparison } from '../models/query-parameter';

const GET_MY_QUIZ: string = "getQuiz";

@Injectable({
  providedIn: 'root'
})
export class TakeQuizRepositoryService {

  constructor(
    private http: HttpGraphQLService,
    private graphqlTemplateService: GraphQLTemplateService) { }

  get(id: string): Observable<QuizSession> {
    let input = new GraphQLInput();

    let qp = new QueryParameter();
    qp.comparison = Comparison.Equals;
    qp.name = "id";
    qp.value = id;

    input.operationName = "";
    input.query = this.graphqlTemplateService.convertToQuery(GET_MY_QUIZ, [qp], ["id", "name", "questions {\n id \n text \n choicesJson \n explainJson \n tagsJson }\n"]);
    input.variables = {};

    return this.http.postAsync<QuizSession>(GET_MY_QUIZ, input, true);
  }
}
