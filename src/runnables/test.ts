import RunnableSequence from "./RunnableSequence";
import RunnableBranch from "./RunnableBranch";
import type {ExternalInputCollector} from "./RunnableExternalInput";
import RunnableExternalInput from "./RunnableExternalInput";

enum Subject {
  ENGLISH = "english",
  MATH = "math",
  SCIENCE = "science"
}

async function getRandomScore(totalScore: number): Promise<number> {
  const score = await Promise.resolve(Math.floor(Math.random() * totalScore));
  return score;
}

function calculateAverage(scores: Record<string, number>): number {
  const totalScore = Object.values(scores).reduce((acc, score) => acc + score, 0);
  return totalScore / Object.keys(scores).length;
}

const chooseTotalScore = RunnableBranch.from<Subject, number>([
  [
    (subject) => subject === Subject.ENGLISH,
    () => 150
  ],
  [
    (subject) => subject === Subject.MATH,
    () => 120
  ],
  () => 100
]);

interface RunConfig {
  externalInputCollectors: {
    poApprove: ExternalInputCollector<number, boolean>
  }
}

const poApprove = RunnableExternalInput.from<number, boolean, RunConfig, "poApprove">("poApprove");

const finalExam = RunnableSequence.from<Subject, boolean>([
  chooseTotalScore,
  {
    "jiali": getRandomScore,
    "zyao": getRandomScore,
    "cjiang": getRandomScore,
    "dawang": getRandomScore
  },
  calculateAverage,
  poApprove
]);

const result = await finalExam.run(Subject.ENGLISH);
console.log("The average score is %s", result);
