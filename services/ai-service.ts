"server-only";

import redis from "@/lib/redis";
import pdfParse from "pdf-parse";
import { GoogleGenAI } from "@google/genai";
import { analysisSchema } from "@/services/response-schema";
import { ContractAnalysis } from "@/utils/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const extractTextFromPDF = async (fileKey: string): Promise<string> => {
    const fileData = (await redis.get(fileKey)) as string;
    if (!fileData) {
        throw new Error("File not found");
    }

    const buffer = Buffer.from(fileData, "base64");
    const pdf = await pdfParse(buffer);

    return pdf.text;
};

export const detectContractType = async (contractText: string): Promise<string> => {
    const prompt = `
    Analyze the following contract text and determine the type of contract it is.
    Provide only the contract type as a single string (e.g., "Employment", "Non-Disclosure Agreement", "Sales", "Lease", etc.).
    Do not include any additional explanation or text.

    Contract text:
    ${contractText.substring(0, 2000)}
  `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
    });
    if (!response.text) {
        throw new Error("Failed to detect contract type");
    }

    const contractType = response.text.trim();
    return contractType;

    // const analysis = await analyzeContract(contractText, contractType);
    // return analysis;
};

export const analyzeContract = async (contractText: string, contractType: string) => {
    let prompt = `
    Analyze the following ${contractType} contract and provide:
    1. A list of at least 10 potential risks for the party receiving the contract, each with a brief explanation and severity level (low, medium, high).
    2. A list of at least 10 potential opportunities or benefits for the receiving party, each with a brief explanation and impact level (low, medium, high).
    3. A comprehensive summary of the contract, including key terms and conditions.
    4. Any recommendations for improving the contract from the receiving party's perspective.
    5. A list of key clauses in the contract.
    6. An assessment of the contract's legal compliance.
    7. A list of potential negotiation points.
    8. The contract duration or term, if applicable.
    9. A summary of termination conditions, if applicable.
    10. A breakdown of any financial terms or compensation structure, if applicable.
    11. Any performance metrics or KPIs mentioned, if applicable.
    12. A summary of any specific clauses relevant to this type of contract (e.g., intellectual property for employment contracts, warranties for sales contracts).
    13. An overall score from 1 to 100, with 100 being the highest. This score represents the overall favorability of the contract based on the identified risks and opportunities.
  `;

    prompt += `
          Important: Provide only the JSON object in your response, without any additional text or formatting. 
          Contract text:
        ${contractText}
        `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
        },
    });

    const analysisResponse = response.text ? JSON.parse(response.text) : null;
    if (!analysisResponse) {
        throw new Error("Failed to parse AI response");
    }

    return analysisResponse as ContractAnalysis;
};
