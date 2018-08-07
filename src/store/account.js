import { Store } from '../storeLib';

export default new Store(
  {accountStuff: 'stuff'},
  (state) => ({
    changeAccountStuff: (newStuff) => ({...state, accountStuff: newStuff}),
    fetchDataStart: () => {
      return ({...state, fetchDataPending: true})
    },
    fetchDataSuccess: (data) => ({...state, data}),
    fetchDataFail: (errorMsg) => ({...state, fetchDataErrorMsg: errorMsg}),
    fetchDataEnd: () => {
      return ({...state, fetchDataPending: false})
    }
  })
);

export const fetchData = (methods) => {
  methods.account.fetchDataStart()
  setTimeout(() => {
    methods.account.fetchDataSuccess(Math.random() + '')
    methods.account.fetchDataEnd()
  }, 3000)
}
