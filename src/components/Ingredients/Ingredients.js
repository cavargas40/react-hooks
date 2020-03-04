import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

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

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('Should not get tjere!');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null
  });

  //const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  // useEffect(() => {
  //   fetch('https://react-hooks-b3a98.firebaseio.com/ingredients.json')
  //     .then(response => response.json())
  //     .then(responseData => {
  //       const loadedIngredients = [];
  //       for (const key in responseData) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         });
  //       }
  //       setUserIngredients(loadedIngredients);
  //     });
  // }, []);
  //useEffect with array like second parameter is like componentDidMount

  useEffect(() => {
    console.log('rendering Ingredients');
  }, [userIngredients]);
  //usefull to track a var that is changing

  const filterIngredientHandler = useCallback(filterIngredients => {
    dispatch({ type: 'SET', ingredients: filterIngredients });
    //setUserIngredients(filterIngredients);
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    //setIsLoading(true);
    dispatchHttp({ type: 'SEND' });
    fetch('https://react-hooks-b3a98.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(responseData => {
        dispatchHttp({ type: 'RESPONSE' });
        console.log('responseData', responseData);
        dispatch({
          type: 'ADD',
          ingredient: { id: responseData.name, ...ingredient }
        });
        // setUserIngredients(prevIngredients => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient }
        // ]);
      });
  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    dispatchHttp({ type: 'SEND' });
    fetch(
      `https://react-hooks-b3a98.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'
      }
    )
      .then(response => {
        dispatchHttp({ type: 'RESPONSE' });
        dispatch({ type: 'DELETE', id: ingredientId });
        // setUserIngredients(prevIngredients =>
        //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        // );
      })
      .catch(error => {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong' });
        //setError(error.message);
        //setIsLoading(false);
      });
  }, []);

  const clearError = useCallback(() => {
    //setError(null);
    dispatchHttp({ type: 'CLEAR' });
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
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientHandler} />
        {ingredientsList}
      </section>
    </div>
  );
};

export default Ingredients;
