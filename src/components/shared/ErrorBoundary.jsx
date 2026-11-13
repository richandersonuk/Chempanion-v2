import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Applet runtime error caught by ErrorBoundary:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto my-10 p-8 bg-white border-2 border-rose-200 rounded-3xl shadow-lg text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl font-black">
            ⚠️
          </div>
          <h3 className="text-lg font-black text-slate-800">
            Applet Encountered a Runtime Error
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Something unexpected went wrong inside this calculation module. Your overall progress is safe.
          </p>
          {this.state.error && (
            <pre className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-rose-700 overflow-x-auto text-left">
              {this.state.error.message || String(this.state.error)}
            </pre>
          )}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-[#326fa0] hover:bg-[#255580] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Reset Applet ↻
            </button>
            {this.props.onReturnHome && (
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  this.props.onReturnHome();
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Dashboard Home
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
