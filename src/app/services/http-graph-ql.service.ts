import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';
import { GraphQLInput } from '../models/graph-qlinput';
import { GraphQLResponse } from '../models/graph-qlresponse';
import { GraphQLError } from '../models/graph-qlerror';
import { LoggingService } from './logging.service';
@Injectable({
  providedIn: 'root'
})
export class HttpGraphQLService {

  constructor(
    private http: HttpClient,
    private adalSvc: MsAdalAngular6Service,
    private logging: LoggingService) { }

  postAsync<TOutput>(typeName: string, graphInput: GraphQLInput, disableAdal: boolean = false): Observable<TOutput> {

    this.logging.log("postAsync: " + typeName);

    return new Observable<TOutput>((observable) => {

      var handleError = (err: any) => {
        this.logging.log(err);
        observable.error(err);
      };

      var handleSuccess = (result: GraphQLResponse) => {

        if (result.errors) {
          if (result.errors.length > 0) {
            let errors = <GraphQLError[]>result.errors;
            errors.forEach(x => observable.error(x.message));
            return;
          }
        }
        if (result.data) {
          var raw = result.data[typeName];
          if (raw !== null) {
            let dto: TOutput = <TOutput>raw;
            observable.next(dto);
            observable.complete();
            return;
          }
        } 
        observable.next(null);
        observable.complete();
      };

      let endpoint: string = disableAdal ? environment.graphQL.readonlyEndpoint : environment.graphQL.endpoint;
      let input = JSON.stringify(graphInput);

      if (disableAdal === true) {

        this.http.post(endpoint, input, {
          headers: {
            "Content-Type": "application/json"
          }
        }).subscribe(handleSuccess, handleError);

      } else {
        this.adalSvc.acquireToken(environment.adalConfig.clientId).subscribe((token: string) => {

          this.logging.log("Token was obtained successfully for endpoint: " + endpoint);

          this.logging.log(input);

          this.http.post(endpoint, input, {
            headers: {
              authorization: "Bearer " + token,
              "Content-Type": "application/json"
            }
          }).subscribe(handleSuccess, handleError);

        }, handleError);
      }
    });
  }
}
