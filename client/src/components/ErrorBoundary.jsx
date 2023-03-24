import React from "react";
class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch() {
        this.setState({ hasError: true });
    }
  
    render() {
      if (this.state.hasError) {
        return <h1 className="text-white text-center text-xl w-[40%]">Something went wrong with this component. <br /><span className="text-4xl text-rose-500 font-bold">"Sorry" <br />☠</span></h1>;
      }
  
      return this.props.children; 
    }
  }

  export default ErrorBoundary;