# yet-another-react-store

## The `store` directory
Create a directory called `store` (or whatever you want) in your `src` directory.

This is where you will create you individual "stores".

For example your `store` directory would contain an `index.js` file that may look something like this:

```javascript
// store/index.js
import user from './user';
import account from './account';

export default {
  user,
  account
};

```

As you can see, the index.js file expects two files also in the `store` directory called `user.js` and `account.js`.

They may each look something like this respectively:

```javascript
// store/account.js
import { Store } from '../storeLib';

export default new Store(
  {accountStuff: 'stuff'},
  (state) => ({
    changeAccountStuff: (newStuff) => ({...state, accountStuff: newStuff}),
    fetchDataStart: () => ({...state, fetchDataPending: true}),
    fetchDataSuccess: (data) => ({...state, data}),
    fetchDataFail: (errorMsg) => ({...state, fetchDataErrorMsg: errorMsg}),
    fetchDataEnd: () => ({...state, fetchDataPending: false})
  })
);

export const fetchData = (methods) => {
  methods.account.fetchData.start()
  
  // The setTimeout is only meant to simulate asynchronous operations.
  setTimeout(() => {
    methods.account.fetchData.success('some value')
    methods.account.fetchData.end()
  }, 3000)
}

```

and

```javascript
// store/user.js
import { Store } from '../storeLib';

export default new Store(
  {email: 'the email', jwt: 'the jwt'},
  (state) => ({
    changeEmail: (newEmail) => ({...state, email: newEmail}),
    updateJwt: (newJwt) => ({...state, jwt: newJwt})
  })
);

```

Notice how each file exports as a default a new `Store` instance that expects a `defaultState` as a first parameter (which can be of virtually any type) and `methods` as a second parameter which must be a callback that provides the state and returns an object with methods as props. Since these methods are mechanism we use for changing the state, each of the methods is expected to return the new state (think redux reducer style).

You may also have noticed in the `store/account.js` file that there is a function called fetchData that is being exported.  This will be explained in the section entitled "Asynchronous methods".

## The store provider

In order for the store to be accessible to the components in your React app you will need to inject the store using the StoreProvider component that can be used to wrap all of your app or only a portion of it.  For the sake of this example we'll assume that we are wrapping the entire app as show in the following example.

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { StoreProvider } from './storeLib';
import store from './store/';

ReactDOM.render(
  <StoreProvider store={store}>
    <App/>
  </StoreProvider>,
  document.getElementById('root')
);

```

As you can see, the `StoreProvider` component is imported from the `storeLib.js` file and the `store` object is imported from the `store/index.js` file we created earlier.  It is then passed into the `StoreProvider` on the `store` property.

## Connecting the store to a component

Now that the store is being "provided" to the app.  We'll want a way to gain access to the data in the store as well as the methods we created earlier.  The way to do this is by importing the `connectStore` method from the `storeLib.js` file.

Then in the component file, connect the exported component to the store as shown here:

```jsx harmony
// MyComponent.js
import React from 'react';
import _ from 'lodash';

import { connectStore } from './storeLib';
import { fetchData } from './store/account';

const MyComponent = (props) => {
  return (
    <ul>
      <li><button onClick={() => props.fetchData('25')}>fetch data</button></li>
      <li>fetchDataPending: {_.get(props, 'account.fetchDataPending') ? 'true' : 'false'}</li>
      <li>{_.get(props, 'account.data')}</li>
      <li><button onClick={() => props.changeEmail('new email')}>ChangeEmail</button></li>
      <li>{props.user.email}</li>
      <li><button onClick={() => props.updateJwt('new jwt')}>UpdateJwt</button></li>
      <li>{props.user.jwt}</li>
      <li><button onClick={() => props.changeAccountStuff('new accountStuff')}>ChangeAccountStuff</button></li>
      <li>{props.account.accountStuff}</li>
    </ul>
  );
}

const mapStoreToProps = ({user, account}) => {
  return {user, account}
}

const mapMethodsToProps = (methods) => {
  return {
    changeEmail: methods.user.changeEmail,
    updateJwt: methods.user.updateJwt,
    changeAccountStuff: methods.account.changeAccountStuff,
    fetchData: (...rest) => fetchData(methods, ...rest)
  }
}

export default connectStore(mapStoreToProps, mapMethodsToProps)(MyComponent)
```

You may have noticed that the `mapMethodsToProps` function returns a `fetchData` method as one of the props on the returned object and that it doesn't follow the same pattern as the other methods.  This is an example of how to call an method that needs to handle asynchronous logic such as making a REST request.  This will be explained in detail in the section entitled "Asynchronous methods".

## Asynchronous methods
Sometimes actions need to be performed that are asynchronous. nRemember the `store/account.js` file we looked at earlier?
