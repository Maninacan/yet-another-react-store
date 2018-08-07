# yet-another-react-store

## The `store` directory
Create a directory called `store` (or whatever you want) in your `src` directory.

This is where you will create your individual "stores".

For example your `store` directory would contain an `index.js` file that may look something like this:

```javascript
// store/index.js
import { combineProviders, combineConsumers, bindStore } from './storeUtils';

import { DeckOfCardsProvider, DeckOfCardsConsumer } from './deckOfCards';
import { UserProvider, UserConsumer } from './user';

export const StoreProvider = combineProviders(DeckOfCardsProvider, UserProvider);
export const StoreConsumer = combineConsumers(
  { name: 'deckOfCards', Consumer: DeckOfCardsConsumer },
  { name: 'user', Consumer: UserConsumer }
);
export const connectStore = bindStore(StoreConsumer);

```

As you can see, the index.js file expects 3 files also in the `store` directory called `storeUtils.js`, `deckOfCards.js` and `user.js`.

The `storeUtils.js` file contains 3 helper methods, `combineProviders`, `combineConsumers` and `bindStore`;

The other 2 may each look something like this respectively:

```javascript
// store/deckOfCards.js
import React from 'react';
import { drawCardsApi, getDeckOfCardsApi } from '../api/deckOfCardsApi';

const DeckOfCardsContext = React.createContext();

export class DeckOfCardsProvider extends React.Component {
  constructor(props) {
    super(props);

    this.getDeckOfCardsStart = () => this.setState((state) => ({...state, getDeckOfCardsPending: true}));
    this.getDeckOfCardsSuccess = (data) => this.setState((state) => ({...state, deckOfCardsData: data}));
    this.getDeckOfCardsFail = (errorMessage) => this.setState((state) => ({...state, getDeckOfCardsErrorMessage: errorMessage}));
    this.getDeckOfCardsEnd = () => this.setState((state) => ({...state, getDeckOfCardsPending: false}));

    this.getDeckOfCardsErrorHandler = () => {
      return (error) => {
        this.getDeckOfCardsFail(error.message);
        this.getDeckOfCardsEnd();
      }
    }

    this.getDeckOfCards = () => {
      this.getDeckOfCardsStart();
      getDeckOfCardsApi()
        .then((response) => {
          return drawCardsApi(response.data.deck_id, 26)
            .then((response) => {
              this.getDeckOfCardsSuccess(response.data);
              this.getDeckOfCardsEnd();
            })
            .catch(this.getDeckOfCardsErrorHandler());
        })
        .catch(this.getDeckOfCardsErrorHandler());
    }
    this.state = {
      getDeckOfCardsPending: false,
      deckOfCardsData: null,
      getDeckOfCardsErrorMessage: null,
      getDeckOfCards: this.getDeckOfCards
    };
  }

  render() {
    const { children } = this.props;
    return (
      <DeckOfCardsContext.Provider value={this.state}>
        {children}
      </DeckOfCardsContext.Provider>
    );
  }
}

export const DeckOfCardsConsumer = DeckOfCardsContext.Consumer;


```

and

```javascript
// store/user.js
import React from 'react';

const UserContext = React.createContext();

export class UserProvider extends React.Component {
  constructor(props) {
    super(props);

    this.changeEmail = (newEmail) => this.setState((state) => ({...state, email: newEmail}));
    this.updateJwt = (newJwt) => this.setState((state) => ({...state, jwt: newJwt}));

    this.state = {
      email: 'the email',
      jwt: 'the jwt',
      changeEmail: this.changeEmail,
      updateJwt: this.updateJwt
    };
  }

  render() {
    const { children } = this.props;
    return (
      <UserContext.Provider value={this.state}>
        {children}
      </UserContext.Provider>
    );
  }
}

export const UserConsumer = UserContext.Consumer;

```

Notice how each file creates a context using `React.createContext();` and exports a `Provider` and a `Consumer`.

## The store provider

In order for the store to be accessible to the components in your React app you will need to inject the store using the StoreProvider component that can be used to wrap all of your app or only a portion of it.  For the sake of this example we'll assume that we are wrapping the entire app as shown in the following example.

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { StoreProvider } from './store';

ReactDOM.render(
  <StoreProvider>
    <App/>
  </StoreProvider>,
  document.getElementById('root')
);

```

As you can see, the `StoreProvider` component is imported from the `store/index.js` file and wraps the `App` component.

## Connecting the store to a component

Now that the store is being "provided" to the app.  We'll want a way to gain access to the data in the store as well as the methods we created earlier.  There are two ways to do this.

The first is by importing the `StoreConsumer` component from the `store/index.js` file and use it like this:

```javascript
// MyComponent.js
import React from 'react';

import { StoreConsumer } from './store/';

const MyComponent = () => {
  return (
    <StoreConsumer>
      {({account, deckOfCards, user}) => {
        const { fetchData, fetchDataPending, data, changeAccountStuff, accountStuff } = account;
        const { getDeckOfCards, getDeckOfCardsPending, deckOfCardsData } = deckOfCards;
        const { changeEmail, updateJwt, email, jwt } = user;
        return (
          <div>
            <li><button onClick={() => getDeckOfCards()}>get deck of cards</button></li>
            <li>getDeckOfCardsPending: {getDeckOfCardsPending ? 'true' : 'false'}</li>
            <li>{deckOfCardsData && JSON.stringify(deckOfCardsData)}</li>
            <li><button onClick={() => fetchData('25')}>fetch data</button></li>
            <li>fetchDataPending: {fetchDataPending ? 'true' : 'false'}</li>
            <li>{data}</li>
            <li><button onClick={() => changeEmail(Math.random() + '')}>ChangeEmail</button></li>
            <li>{email}</li>
            <li><button onClick={() => updateJwt(Math.random() + '')}>UpdateJwt</button></li>
            <li>{jwt}</li>
            <li><button onClick={() => changeAccountStuff(Math.random() + '')}>ChangeAccountStuff</button></li>
            <li>{accountStuff}</li>
          </div>
        );
      }}
    </StoreConsumer>
  );
};

export default MyComponent;

```

The second way is to import the `connectStore` method from the `store/index.js` file and use it like this:

```javascript
// MyComponent.js
import React from 'react';

import { connectStore } from './store/';

const MyComponent = ({account, deckOfCards, user}) => {
  const { fetchData, fetchDataPending, data, changeAccountStuff, accountStuff } = account;
  const { getDeckOfCards, getDeckOfCardsPending, deckOfCardsData } = deckOfCards;
  const { changeEmail, updateJwt, email, jwt } = user;
  return (
    <div>
      <li><button onClick={() => getDeckOfCards()}>get deck of cards</button></li>
      <li>getDeckOfCardsPending: {getDeckOfCardsPending ? 'true' : 'false'}</li>
      <li>{deckOfCardsData && JSON.stringify(deckOfCardsData)}</li>
      <li><button onClick={() => fetchData('25')}>fetch data</button></li>
      <li>fetchDataPending: {fetchDataPending ? 'true' : 'false'}</li>
      <li>{data}</li>
      <li><button onClick={() => changeEmail(Math.random() + '')}>ChangeEmail</button></li>
      <li>{email}</li>
      <li><button onClick={() => updateJwt(Math.random() + '')}>UpdateJwt</button></li>
      <li>{jwt}</li>
      <li><button onClick={() => changeAccountStuff(Math.random() + '')}>ChangeAccountStuff</button></li>
      <li>{accountStuff}</li>
    </div>
  );
};

const mapStoreToProps = ({account, deckOfCards, user}) => {
  return {
    account, deckOfCards, user
  }
}

export default connectStore(mapStoreToProps)(MyComponent);

```

You may have noticed that the `mapStoreToProps` callback function is expected if you choose to go the second way.

## Asynchronous actions
Sometimes actions need to be performed that are asynchronous. Remember the `store/deckOfCards.js` file we looked at earlier?

```javascript
// store/deckOfCards.js
import React from 'react';
import { drawCardsApi, getDeckOfCardsApi } from '../api/deckOfCardsApi';

const DeckOfCardsContext = React.createContext();

export class DeckOfCardsProvider extends React.Component {
  constructor(props) {
    super(props);

    this.getDeckOfCardsStart = () => this.setState((state) => ({...state, getDeckOfCardsPending: true}));
    this.getDeckOfCardsSuccess = (data) => this.setState((state) => ({...state, deckOfCardsData: data}));
    this.getDeckOfCardsFail = (errorMessage) => this.setState((state) => ({...state, getDeckOfCardsErrorMessage: errorMessage}));
    this.getDeckOfCardsEnd = () => this.setState((state) => ({...state, getDeckOfCardsPending: false}));

    this.getDeckOfCardsErrorHandler = () => {
      return (error) => {
        this.getDeckOfCardsFail(error.message);
        this.getDeckOfCardsEnd();
      }
    }

    this.getDeckOfCards = () => {
      this.getDeckOfCardsStart();
      getDeckOfCardsApi()
        .then((response) => {
          return drawCardsApi(response.data.deck_id, 26)
            .then((response) => {
              this.getDeckOfCardsSuccess(response.data);
              this.getDeckOfCardsEnd();
            })
            .catch(this.getDeckOfCardsErrorHandler());
        })
        .catch(this.getDeckOfCardsErrorHandler());
    }
    this.state = {
      getDeckOfCardsPending: false,
      deckOfCardsData: null,
      getDeckOfCardsErrorMessage: null,
      getDeckOfCards: this.getDeckOfCards
    };
  }

  render() {
    const { children } = this.props;
    return (
      <DeckOfCardsContext.Provider value={this.state}>
        {children}
      </DeckOfCardsContext.Provider>
    );
  }
}

export const DeckOfCardsConsumer = DeckOfCardsContext.Consumer;

```

It contains 5 methods called `getDeckOfCardsStart`, `getDeckOfCardsSuccess`, `getDeckOfCardsFail`, `getDeckOfCardsEnd` and `getDeckOfCards`.  The `start` and `end` methods are typically used to only toggle a `pending` value.  The `success` method is where the data is received and put on the state and of course the `fail` method is where any error messages are set on the state.  Notice how the `getDeckOfCards` method calls the other 4 methods at the appropriate times in async process, and that it is the only method of the 5 that is assigned to the state object.
