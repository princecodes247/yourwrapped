import { WrappedData } from "@/types/wrapped";

export const encodeData = (data: WrappedData): string => {
    try {
        const jsonString = JSON.stringify(data);
        return btoa(encodeURIComponent(jsonString));
    } catch (error) {
        console.error("Error encoding data:", error);
        return "";
    }
};

export const decodeData = (encoded: string): WrappedData | null => {
    try {
        const jsonString = decodeURIComponent(atob(encoded));
        return JSON.parse(jsonString) as WrappedData;
    } catch (error) {
        console.error("Error decoding data:", error);
        return null;
    }
};
