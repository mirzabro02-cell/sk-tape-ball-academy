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
        <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-6 text-[#071A36]">
          <div className="w-full max-w-lg rounded-[16px] border border-[#E2E8F0] bg-white p-8 text-center space-y-5 shadow-sm">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#C8202B]/10 text-[#C8202B]">
              <AlertTriangle className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B]">
                Unexpected View Error
              </p>
              <h1 className="text-2xl font-extrabold text-[#071A36]">
                Unable to Display This Section
              </h1>
              <p className="text-sm leading-relaxed text-[#64748B]">
                Something unexpected occurred while rendering this view. Try reloading the screen
                or returning to the SK Tape Ball Academy homepage.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#D9A52E] px-5 text-sm font-semibold text-[#050D1B] hover:bg-[#c59424] cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span>Try Again</span>
              </button>
              <a
                href="/"
                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#071A36] hover:bg-[#F5F7FA]"
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
