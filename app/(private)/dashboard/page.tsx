"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";

export default function Home() {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [detectedType, setDetectedType] = useState<string>("");

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event?.target?.files![0]);
    };
    const detectContractType = async () => {
        const formData = new FormData();
        formData.append("contractDoc", selectedFile!);
        const response = await fetch("/api/contract/detect-type", {
            method: "POST",
            body: formData,
        });

        const { detectedType } = await response.json();
        setDetectedType(detectedType);
    };

    const analyzeContract = async () => {
        const formData = new FormData();
        formData.append("contractType", "Employment Contract");
        formData.append("contractDoc", selectedFile!);
        const response = await fetch("/api/contract/analyze-contract", {
            method: "POST",
            body: formData,
        });

        const { analysis } = await response.json();
        console.log("analysis", analysis);
    };

    return (
        <main className="flex flex-col items-center p-8">
            <span className="font-extrabold text-4xl">Analyze Contracts</span>

            {detectedType && (
                <div className="mt-4 p-2 border rounded-md bg-gray-100">
                    <span className="font-semibold">Detected Contract Type:</span>
                    <span className="ml-2">{detectedType}</span>
                </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4  mt-4 items-center">
                <div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Picture</Label>
                        <Input id="picture" type="file" onChange={handleFileChange} />
                    </div>
                    <Button onClick={detectContractType} className="cursor-pointer">
                        Detect Contract Type
                    </Button>
                </div>
                <Button
                    variant="outline"
                    className="cursor-pointer bg-orange-400 text-white hover:bg-orange-300 hover:text-white"
                    onClick={analyzeContract}>
                    Analyze Contract Type
                </Button>
            </div>
        </main>
    );
}
