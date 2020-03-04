import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilfer, setEnteredFilter] = useState('');

  useEffect(() => {
    setTimeout(() => {
      const query =
        enteredFilfer.length === 0
          ? ``
          : `?orderBy="title"&equalTo="${enteredFilfer}"`;
      fetch('https://react-hooks-b3a98.firebaseio.com/ingredients.json' + query)
        .then(response => response.json())
        .then(responseData => {
          const loadedIngredients = [];
          for (const key in responseData) {
            loadedIngredients.push({
              id: key,
              title: responseData[key].title,
              amount: responseData[key].amount
            });
          }
          onLoadIngredients(loadedIngredients);
        });
    }, 500);
  }, [enteredFilfer, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enteredFilfer}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
