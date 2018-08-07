import React from 'react';
import PropTypes from 'prop-types';

export class Store {
  constructor (defaultState, methods) {
    this.state = defaultState;
    this.methods = methods || (() => ({}));
  }
}

const StoreContext = React.createContext();
export class StoreProvider extends React.PureComponent {
  static propTypes = {
    store: PropTypes.objectOf(PropTypes.instanceOf(Store)).isRequired
  }

  constructor(props) {
    super(props);

    const self = this;
    const { store } = props;

    const linkMethods = (rawMethods, storeName) => {
      const methods = {}
      Object.keys(rawMethods()).forEach((key) => {
        methods[key] = (...rest) => {
          this.setState({...self.state, [storeName]: rawMethods(Object.freeze(self.state[storeName]))[key](...rest)})
        }
      });

      return methods;
    }

    self.state = {};
    self.methods = {};

    Object.keys(store).forEach((key) => {
      self.state[key] = store[key].state;
      self.methods[key] = linkMethods(store[key].methods, key)
    })
  }

  render = () => {
    const { children } = this.props;
    return (
      <StoreContext.Provider value={{state: this.state, methods: this.methods}}>
        {children}
      </StoreContext.Provider>
    );
  }
}

export const connectStore = (mapStoreToProps, mapMethodsToProps) => {
  return (WrappedComponent) => {
    return class extends React.Component {
      render() {
        return (
          <StoreContext.Consumer>
            {({state, methods}) => {
              const props = {...this.props, ...mapStoreToProps(state), ...mapMethodsToProps(methods)};
              return <WrappedComponent {...props}/>
            }}
          </StoreContext.Consumer>
        );
      }
    };
  }
};

