interface QuestionBase {
   question: string;
   checker: (answer: string) => boolean;
}

export interface QuestionMultipleChoice extends QuestionBase {
   type: "multiple-choice";
   choices: string[];
}

export interface QuestionIdentification extends QuestionBase {
   type: "identification";
}

export interface QuestionEnumeration extends QuestionBase {
   type: "enumeration";
}

export interface QuestionMultipleSelection extends QuestionBase {
   type: "multiple-selection";
   choices: string[];
}

export type Question =
   | QuestionMultipleChoice
   | QuestionIdentification
   | QuestionEnumeration
   | QuestionMultipleSelection;
