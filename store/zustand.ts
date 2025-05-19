import { create } from "zustand";

interface ContractState {
    analysisResults: [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAnalysisResults: (results: any) => void;
}
const useContractStore = create<ContractState>(set => ({
    analysisResults: [],
    setAnalysisResults: results => set({ analysisResults: results }),
}));

export { useContractStore };
