import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get tjere!');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    data,
    error,
    sendRequest,
    reqExtra,
    reqIdentifier
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...reqExtra }
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filterIngredientHandler = useCallback(filterIngredients => {
    dispatch({ type: 'SET', ingredients: filterIngredients });
    //setUserIngredients(filterIngredients);
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-hooks-b3a98.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
    //setIsLoading(true);
    // dispatchHttp({ type: 'SEND' });
    // fetch('https://react-hooks-b3a98.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    // })
    //   .then(response => response.json())
    //   .then(responseData => {
    //     dispatchHttp({ type: 'RESPONSE' });
    //     console.log('responseData', responseData);
    //     dispatch({
    //       type: 'ADD',
    //       ingredient: { id: responseData.name, ...ingredient }
    //     });
    //     // setUserIngredients(prevIngredients => [
    //     //   ...prevIngredients,
    //     //   { id: responseData.name, ...ingredient }
    //     // ]);
    //   });
  }, []);

  const removeIngredientHandler = useCallback(
    ingredientId => {
      sendRequest(
        `https://react-hooks-b3a98.firebaseio.com/ingredients/${ingredientId}.json`,
        'DELETE',
        null,
        ingredientId,
        'REMOVE_INGREDIENT'
      );

      // dispatchHttp({ type: 'SEND' });
      // fetch(
      //   `https://react-hooks-b3a98.firebaseio.com/ingredients/${ingredientId}.json`,
      //   {
      //     method: 'DELETE'
      //   }
      // )
      //   .then(response => {
      //     dispatchHttp({ type: 'RESPONSE' });
      //     dispatch({ type: 'DELETE', id: ingredientId });
      //     // setUserIngredients(prevIngredients =>
      //     //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      //     // );
      //   })
      //   .catch(error => {
      //     dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong' });
      //     //setError(error.message);
      //     //setIsLoading(false);
      //   });
    },
    [sendRequest]
  );

  const clearError = useCallback(() => {
    //setError(null);
    //dispatchHttp({ type: 'CLEAR' });
  }, []);

  const ingredientsList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientHandler} />
        {ingredientsList}
      </section>
    </div>
  );
};

export default Ingredients;
