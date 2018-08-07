import { Store } from '../storeLib';
import { getDeckOfCardsApi, drawCardsApi } from '../api/deckOfCardsApi';

export default new Store({
  deckOfCards: null
}, (state) => ({
  getDeckOfCardsStart: () => ({...state, getDeckOfCardsPending: true}),
  getDeckOfCardsSuccess: (data) => ({...state, deckOfCards: data}),
  getDeckOfCardsFail: (errorMessage) => ({...state, getDeckOfCardsErrorMessage: errorMessage}),
  getDeckOfCardsEnd: () => ({...state, getDeckOfCardsPending: false})
}));

const getDeckOfCardsErrorHandler = (methods) => {
  return (error) => {
    methods.deckOfCards.getDeckOfCardsFail(error.message);
    methods.deckOfCards.getDeckOfCardsEnd();
  }
}
export const getDeckOfCards = (methods) => {
  methods.deckOfCards.getDeckOfCardsStart();
  getDeckOfCardsApi()
    .then((response) => {
      return drawCardsApi(response.data.deck_id, 26)
        .then((response) => {
          methods.deckOfCards.getDeckOfCardsSuccess(response.data);
          methods.deckOfCards.getDeckOfCardsEnd();
        })
        .catch(getDeckOfCardsErrorHandler(methods));
    })
    .catch(getDeckOfCardsErrorHandler(methods));
}
