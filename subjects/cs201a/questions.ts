import { Question } from "../../types";

const questions: Question[] = [
   {
      type: "identification",
      question: "Building blocks of any program or software.",
      checker(answer) {
         return true;
      },
   },
   {
      type: "multiple-choice",
      question: "multiple-choice",
      checker(answer) {
         return true;
      },
      choices: ["a", "b", "c"],
   },
   {
      type: "multiple-selection",
      question: "multiple-selection",
      checker(answer) {
         return true;
      },
      choices: ["a", "b", "c"],
   },
   {
      type: "enumeration",
      question: "enumeration",
      checker(answer) {
         return true;
      },
   },
];

export { questions };
