import { useReducer, useCallback } from 'react';

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('Should not get tjere!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null
  });

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
      fetch(url, {
        method,
        body,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          return response.json();
          // setUserIngredients(prevIngredients =>
          //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
          // );
        })
        .then(responseData => {
          dispatchHttp({ type: 'RESPONSE', responseData, extra: reqExtra });
        })
        .catch(error => {
          dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong' });
          //setError(error.message);
          //setIsLoading(false);
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier
  };
};

export default useHttp;
