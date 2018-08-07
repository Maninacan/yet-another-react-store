import React from 'react';

export const combineProviders = (...providers) => {
  if (providers.length === 0) {
    console.error('No arguments provided. combineProviders expects at least 1');
  }

  return providers.reduce((Acc, Curr) => {
    if (!Acc) {
      return Curr;
    } else {
      return ({children}) => <Acc><Curr>{children}</Curr></Acc>
    }
  }, null);
};

export const combineConsumers = (...consumers) => {
  if (consumers.length === 0) {
    console.error('No arguments provided. injectConsumers expects at least 1');
  }

  return consumers.reduce((Acc, curr) => {
    if (!Acc) {
      return ({children}) => (
        <curr.Consumer>
          {(currValue) => {
            return children({[curr.name]: currValue});
          }}
        </curr.Consumer>
      );
    } else {
      return ({children}) => {
        return (
          <Acc>
            {(accValue) => {
              return (
                <curr.Consumer>
                  {(currValue) => {
                    return children({...accValue, [curr.name]: currValue});
                  }}
                </curr.Consumer>
              );
            }}
          </Acc>
        );
      };
    }
  }, null);
};

export const bindStore = (Consumer) => {
  return (mapStoreToProps) => {
    return (WrappedComponent) => {
      return (props) => (
        <Consumer>
          {(store) => {
            const newProps = {...props, ...mapStoreToProps(store)};
            return (
              <WrappedComponent {...newProps}/>
            );
          }}
        </Consumer>
      );
    };
  }
}
