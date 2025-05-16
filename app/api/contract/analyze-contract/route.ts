import redis from "@/lib/redis";
import { analyzeContract, extractTextFromPDF } from "@/services/ai-service";
import { sendResponse } from "@/utils/api-response";

export const POST = async (request: Request) => {
    try {
        const body = await request.formData();
        const contractDoc = body.get("contractDoc") as File;

        if (!contractDoc) {
            return sendResponse({ error: "No contract document provided" }, 400);
        }
        const user = { id: "user123" }; // Replace with actual user retrieval logic
        const uint8Array = new Uint8Array(await contractDoc.arrayBuffer());
        const base64Data = Buffer.from(uint8Array).toString("base64");
        const fileKey = `file:${user.id}:${Date.now()}`;
        await redis.set(fileKey, base64Data, { ex: 3600 }); // Set expiration to 1 hour

        const contractText = await extractTextFromPDF(fileKey);
        const contractType = body.get("contractType") as string;

        const analysis = await analyzeContract(contractText, contractType);

        if (!analysis.summary || !analysis.risks || !analysis.opportunities) {
            throw new Error("Failed to analyze contract");
        }

        await redis.del(fileKey);
        return sendResponse({ analysis }, 200);
    } catch (error) {
        console.log("error", error);
        return sendResponse({ error: "Internal Server Error" }, 500);
    }
};
