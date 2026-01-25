import React from 'react'

type State = { hasError: boolean }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any) {
    console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-8">Đã xảy ra lỗi. Vui lòng tải lại trang.</div>
    }
    return this.props.children
  }
}
