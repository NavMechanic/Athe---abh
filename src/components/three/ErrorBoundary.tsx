'use client';

import { Component, type ReactNode } from 'react';

/** Swaps in the static fallback if the 3D scene fails (lost context, chunk load error). */
export class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
