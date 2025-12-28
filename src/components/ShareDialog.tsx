import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Twitter, Facebook, Linkedin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    wrappedId: string;
}

export function ShareDialog({ open, onOpenChange, wrappedId }: ShareDialogProps) {
    const [copied, setCopied] = useState(false);
    const shareUrl = `${window.location.origin}/share?id=${wrappedId}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const shareToSocial = (platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp') => {
        const text = "Check out my 2025 Wrapped! 🎁";
        const url = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(text);

        let shareLink = '';
        switch (platform) {
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`;
                break;
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${encodedText}%20${url}`;
                break;
        }

        window.open(shareLink, '_blank', 'width=600,height=400');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share your Wrapped</DialogTitle>
                    <DialogDescription>
                        Your Wrapped is ready! Share it with the world.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Input
                            id="link"
                            defaultValue={shareUrl}
                            readOnly
                            className="h-9"
                        />
                    </div>
                    <Button
                        variant="glossy" type="submit" size="sm" className="px-3" onClick={handleCopy}>
                        <span className="sr-only">Copy</span>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    <Button variant="outline" size="icon" onClick={() => shareToSocial('twitter')}>
                        <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => shareToSocial('facebook')}>
                        <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => shareToSocial('linkedin')}>
                        <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => shareToSocial('whatsapp')}>
                        <span className="font-bold text-xs">WA</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
