import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SK Tape Ball Academy UI ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA] dark:bg-[#07152C] p-6 text-[#07152C] dark:text-white">
          <div className="w-full max-w-lg rounded-[16px] border border-[#E2E8F0] dark:border-white/12 bg-white dark:bg-[#0F213B] p-8 text-center space-y-5 shadow-[var(--shadow-card)]">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#C8202B]/12 text-[#C8202B] dark:text-[#F87171]">
              <AlertTriangle className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B] dark:text-[#F87171]">
                Unexpected View Error
              </p>
              <h1 className="text-2xl font-extrabold text-[#07152C] dark:text-white">
                Unable to Display This Section
              </h1>
              <p className="text-sm leading-relaxed text-[#64748B] dark:text-[#B8C7DF]">
                Something unexpected occurred while rendering this view. Try reloading the screen
                or returning to the SK Tape Ball Academy homepage.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-b from-[#E4BC54] to-[#D5A83C] px-5 text-sm font-semibold text-[#050D1B] hover:from-[#ECC96B] hover:to-[#E0B347] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span>Try Again</span>
              </button>
              <a
                href="/"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#CBD5E1] dark:border-white/16 bg-white dark:bg-[#162B4D] px-5 text-sm font-semibold text-[#07152C] dark:text-white hover:bg-[#F4F6FA] dark:hover:bg-[#1E3F73]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>Return Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
