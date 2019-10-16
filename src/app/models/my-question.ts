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
    selected: boolean;
    quizFilterTags: string[];

    isV2(): boolean {
        if (this.tags && this.tags.length > 0) {
            return this.tags.filter(x => x.key == "version" && x.value == "2").length === 1;
        }
        return false;
    }

    addV2(): void {
        let myTag = new MyTag();
        myTag.key = "version";
        myTag.value = "2";
        this.tags.push(myTag);
    }
}


