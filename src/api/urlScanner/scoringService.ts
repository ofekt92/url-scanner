import { Stats } from "@/models/score";

export class ScoringService {
    private maxAllowedMalicious = 0;
    private maxAllowedSuspicious = 3;
    private maxAllowedUndetected = 50;

    public calculateScore({ malicious, suspicious, undetected }: Stats): number {
        if (malicious > this.maxAllowedMalicious) {
            console.error("Malicious score is too high");
            return 0;
        }

        if (suspicious > this.maxAllowedSuspicious) {
            console.error("Suspicious score is too high");
            return 0;
        }
        if (undetected > this.maxAllowedUndetected) {
            console.error("Undetected score is too high");
            return 0;
        }

        let totalScore = 100;
        totalScore -= malicious * 10;
        totalScore -= suspicious * 5;
        totalScore -= undetected * 1;

        return totalScore;
    }
}