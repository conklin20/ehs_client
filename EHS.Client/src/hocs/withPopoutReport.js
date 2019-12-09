import React, { PureComponent, Fragment } from 'react';
import ReactDOM from 'react-dom';

export default function withPopoutReport(ComponentToBeRendered) {
    class RenderReport extends PureComponent {
        constructor(props){
            super(props);
    
            this.containerEl = document.createElement('div');
            this.externalWindow = null;
        }
    
        render() {
            // return <ComponentToBeRendered {...this.props} />;
            return ReactDOM.createPortal(<ComponentToBeRendered {...this.props}/>, this.containerEl); 
        }
    
        componentDidMount() {
            const { size } = this.props;  
            console.log('Component mounting...')
            this.externalWindow = window.open('', '', `width=${size.width}, height=${size.height}, left=${size.left}, top=${size.top}`);
    
            this.externalWindow.document.body.appendChild(this.containerEl);
        }
    
        componentWillUnmount() {
            // console.log(this.props)
            // console.log('Closing window...')
            this.externalWindow.close(); 
        }
    }

    return RenderReport;
}