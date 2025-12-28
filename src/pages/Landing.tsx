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
              Turn what you felt, and remembered
              into a Wrapped they'll never forget.
            </p>

            {/* CTA */}
            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: '400ms' }}
            >
              <Button
                variant="glossy"
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
        <footer className="py-8 text-center space-y-4">
          <p className="text-xs text-muted-foreground/40">
            Made with care · No account required
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://x.com/princecodes247"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/40 hover:text-primary transition-colors"
              aria-label="X (formerly Twitter)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </a>
            <a
              href="https://github.com/princecodes247/yourwrapped"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/40 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
