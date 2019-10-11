import { MyAnswerChoice } from './my-answer-choice';
import { MyQuestion } from './my-question';

export class MyAnswer {
    question: MyQuestion;
    answers: MyAnswerChoice[];
}
