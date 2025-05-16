import { Type } from "@google/genai";

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        risks: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    risk: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    severity: {
                        type: Type.STRING,
                        enum: ["low", "medium", "high"],
                    },
                },
            },
        },
        opportunities: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    opportunity: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    impact: {
                        type: Type.STRING,
                        enum: ["low", "medium", "high"],
                    },
                },
            },
        },
        summary: { type: Type.STRING },
        recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        keyClauses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        legalCompliance: { type: Type.STRING },
        negotiationPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        contractDuration: { type: Type.STRING },
        terminationConditions: { type: Type.STRING },
        overallScore: {
            type: Type.STRING,
            description: "Overall score from 1 to 100",
        },
        financialTerms: {
            type: Type.OBJECT,
            properties: {
                description: { type: Type.STRING },
                details: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
            },
        },
        performanceMetrics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        specificClauses: { type: Type.STRING },
    },
    propertyOrdering: [
        "summary",
        "risks",
        "opportunities",
        "recommendations",
        "keyClauses",
        "legalCompliance",
        "negotiationPoints",
        "contractDuration",
        "terminationConditions",
        "overallScore",
        "financialTerms",
        "performanceMetrics",
        "specificClauses",
    ],
    required: [
        "risks",
        "opportunities",
        "summary",
        "recommendations",
        "keyClauses",
        "legalCompliance",
        "negotiationPoints",
        "contractDuration",
        "terminationConditions",
        "overallScore",
        "financialTerms",
        "performanceMetrics",
        "specificClauses",
    ],
};

export { analysisSchema };
