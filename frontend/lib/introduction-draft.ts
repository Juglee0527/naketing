export interface IntroductionDraftAnswers {
  identity: string;
  situation: string;
  focus: string;
  closing: string;
}

export type IntroductionDraftApplicationStatus = "applied" | "empty-draft" | "existing-script";

export interface IntroductionDraftApplication {
  status: IntroductionDraftApplicationStatus;
  script: string;
}

function normalizeDraftSentence(value: string): string {
  const sentence = value.trim().replace(/\s+/g, " ");
  if (!sentence) {
    return "";
  }

  return /[.!?。！？]$/.test(sentence) ? sentence : `${sentence}.`;
}

export function createIntroductionDraft(answers: IntroductionDraftAnswers): string {
  return [answers.identity, answers.situation, answers.focus, answers.closing]
    .map(normalizeDraftSentence)
    .filter(Boolean)
    .join(" ");
}

export function applyIntroductionDraft(
  currentScript: string,
  answers: IntroductionDraftAnswers,
): IntroductionDraftApplication {
  if (currentScript.trim()) {
    return { status: "existing-script", script: currentScript };
  }

  const draft = createIntroductionDraft(answers);
  return draft
    ? { status: "applied", script: draft }
    : { status: "empty-draft", script: currentScript };
}
