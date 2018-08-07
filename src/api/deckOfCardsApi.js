import axios from 'axios';

export const getDeckOfCardsApi = () => {
  return axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
}

export const drawCardsApi = (deckId, count = 1) => {
  return axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`)
};
