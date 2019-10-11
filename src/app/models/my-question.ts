import { MyChoice } from './my-choice';
import { ExplainMyChoice } from './explain-my-choice';
import { MyTag } from './my-tag';

export class MyQuestion {
    id: string;
    text: string;
    choices: MyChoice[];
    explain: ExplainMyChoice;
    tags: MyTag[];
    quizId: string;
}


