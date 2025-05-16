import redis from "@/lib/redis";
import { detectContractType, extractTextFromPDF } from "@/services/ai-service";
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

        const pdfText = await extractTextFromPDF(fileKey);
        const detectedType = await detectContractType(pdfText);

        await redis.del(fileKey);

        return sendResponse({ detectedType }, 200);
    } catch (error) {
        console.log("error", error);
        return sendResponse({ error: "Internal Server Error" }, 500);
    }
};
