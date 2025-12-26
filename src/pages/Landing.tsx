import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";

const Landing = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-background flex flex-col">
        {/* Ambient glow effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse-glow"
          />
        </div>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-8 opacity-0 animate-fade-up"
              style={{ animationDelay: '100ms' }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Your 2025 in someone's words</span>
            </div>

            {/* Headline */}
            <h1
              className="text-emotional text-foreground mb-6 opacity-0 animate-fade-up"
              style={{ animationDelay: '200ms' }}
            >
              Create a Wrapped
              <br />
              <span className="text-primary glow-text">for someone you love</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-editorial text-muted-foreground mb-12 max-w-lg mx-auto opacity-0 animate-fade-up"
              style={{ animationDelay: '300ms' }}
            >
              Not data. Not algorithms. Just you, telling their story
              in a beautiful, shareable experience.
            </p>

            {/* CTA */}
            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: '400ms' }}
            >
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate('/create')}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group"
              >
                Create a Wrapped
                <ArrowRight
                  className={`w-5 h-5 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''
                    }`}
                />
              </Button>
            </div>

            {/* Subtle hint */}
            <p
              className="mt-8 text-sm text-muted-foreground/60 opacity-0 animate-fade-up"
              style={{ animationDelay: '500ms' }}
            >
              Takes less than 5 minutes · Free to create · Premium unlocks available
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-xs text-muted-foreground/40">
            Made with care · No account required
          </p>
        </footer>
      </div>
    </>
  );
};

export default Landing;
