import type { IntroductionAnalysisResult } from "./introduction-analysis";

export interface IntroductionComparison {
  characterDifference: number;
  durationDifference: number;
  fillerDifference: number;
  longSentenceDifference: number;
  resolvedStructureLabels: string[];
  newlyMissingStructureLabels: string[];
}

function countFillerPhrases(result: IntroductionAnalysisResult): number {
  return result.fillerPhrases.reduce((sum, finding) => sum + finding.count, 0);
}

export function compareIntroductionResults(
  baseline: IntroductionAnalysisResult,
  current: IntroductionAnalysisResult,
): IntroductionComparison {
  const baselineStructure = new Map(baseline.structureChecks.map((check) => [check.id, check]));

  return {
    characterDifference: current.characterCount - baseline.characterCount,
    durationDifference: current.totalSeconds - baseline.totalSeconds,
    fillerDifference: countFillerPhrases(current) - countFillerPhrases(baseline),
    longSentenceDifference: current.longSentences.length - baseline.longSentences.length,
    resolvedStructureLabels: current.structureChecks
      .filter((check) => check.met && baselineStructure.get(check.id)?.met === false)
      .map((check) => check.label),
    newlyMissingStructureLabels: current.structureChecks
      .filter((check) => !check.met && baselineStructure.get(check.id)?.met === true)
      .map((check) => check.label),
  };
}
