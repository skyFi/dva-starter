import React from 'react';

export default class Container extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      oldChildren: props.children,
      nextChildren: undefined,
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldChildren = this.props.children;
    const nextChildren = nextProps.children;
    this.setState({
      oldChildren,
      nextChildren,
    });
  }

  render() {
    return (
      <div>
        { this.state.oldChildren }
        { this.state.nextChildren }
      </div>
    )
  }
}