import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWrapped } from "@/hooks/use-wrapped";
import WrappedSlides from "@/components/WrappedSlides";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Share = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [id, setId] = useState<string | null>(null);

    // Fetch data using the hook
    const { data: fetchedData, isLoading, isError } = useWrapped(id);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const urlId = searchParams.get('id');
        if (urlId) {
            setId(urlId);
        }
    }, [location]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || (!isLoading && !fetchedData)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
                <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                <p className="text-muted-foreground mb-8">We couldn't load this Wrapped. It might have been deleted or the link is invalid.</p>
                <Button onClick={() => navigate('/create')}>Create your own</Button>
            </div>
        );
    }

    return (
        <WrappedSlides
            data={fetchedData}
            isSharedView={true}
            onAction={() => navigate('/create')}
            actionLabel="Create your own Wrapped"
        />
    );
};

export default Share;
