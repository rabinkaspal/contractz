import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="flex flex-col items-center p-8">
            <span className="font-extrabold text-4xl">Analyze Contracts</span>
            <span className="font-light text-md max-w-[900px] px-24 py-2 text-center">
                AI-powered platform that helps streamline contract analysis. Quickly
                identifiy risks, enhance compliance, and receive insights for faster
                negotiations. Significantly reduce legal costs and accelerat contract
                reviews, allowing businesses to manage contracts more efficiently.
            </span>

            <Button className="cursor-pointer bg-orange-400 text-white hover:bg-orange-300 hover:text-white">
                Get Started
            </Button>
        </main>
    );
}
