import React from 'react';

const AccountContext = React.createContext();

export class AccountProvider extends React.Component {
  constructor(props) {
    super(props);

    this.changeAccountStuff = (newStuff) => this.setState((state) => ({...state, accountStuff: newStuff}));
    this.fetchDataStart = () => this.setState((state) => ({...state, fetchDataPending: true}));
    this.fetchDataSuccess = (data) => this.setState((state) => ({...state, data}));
    this.fetchDataFail = (errorMsg) => this.setState((state) => ({...state, fetchDataErrorMsg: errorMsg}));
    this.fetchDataEnd = () => this.setState((state) => ({...state, fetchDataPending: false}));

    this.fetchData = () => {
      this.fetchDataStart();
      setTimeout(() => {
        this.fetchDataSuccess(Math.random() + '');
        this.fetchDataEnd();
      }, 3000);
    }
    this.state = {
      accountStuff: 'stuff',
      data: null,
      changeAccountStuff: this.changeAccountStuff,
      fetchData: this.fetchData
    };
  }

  render = () => {
    const { children } = this.props;
    return (
      <AccountContext.Provider value={this.state}>
        {children}
      </AccountContext.Provider>
    );
  }
}

export const AccountConsumer = AccountContext.Consumer;
