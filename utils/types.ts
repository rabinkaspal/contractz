export type ContractAnalysis = {
    risks: {
        description: string;
        explanation: string;
        severity: "low" | "medium" | "high";
    }[];
    opportunities: {
        description: string;
        explanation: string;
        impact: "low" | "medium" | "high";
    }[];
    summary: string;
    recommendations: string[];
    keyClauses: string[];
    legalCompliance: string;
    negotiationPoints: string[];
    contractDuration: string;
    terminationConditions: string;
    financialTerms: string;
    performanceMetrics: string[];
    specificClauses: string[];
    overallScore: number;
};
