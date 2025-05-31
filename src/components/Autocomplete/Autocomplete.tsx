import cn from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';
import { getFilteredPeople } from '../../utils/getFilteredPeople';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  selectedPerson: Person | null;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  selectedPerson,
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (selectedPerson) {
      setInputValue(selectedPerson.name);
    } else {
      setInputValue('');
    }
  }, [selectedPerson]);

  const debouncedSetQuery = useMemo(() => debounce(setQuery, delay), [delay]);

  const filteredPeople = useMemo(() => {
    return getFilteredPeople(query, people);
  }, [query, people]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trimStart();

    setInputValue(value);
    debouncedSetQuery(value);
    setIsFocused(true);

    if (selectedPerson && value !== selectedPerson.name) {
      onSelected(null);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    debouncedSetQuery('');
  };

  const handleClickSelectPerson = (selected: Person) => {
    onSelected(selected);
    setIsFocused(false);
    setInputValue(selected.name);
    setQuery('');
  };

  return (
    <>
      <div className="dropdown is-active" ref={wrapperRef}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            id="autocomplete-input"
            aria-autocomplete="list"
            aria-controls="suggestions-list"
            aria-expanded={isFocused}
          />
        </div>

        {isFocused && filteredPeople.length > 0 && (
          <div
            className="dropdown-menu"
            role="menu"
            id="suggestions-list"
            data-cy="suggestions-list"
          >
            <div className="dropdown-content">
              {filteredPeople.map(person => {
                return (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleClickSelectPerson(person)}
                  >
                    <p
                      className={cn({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isFocused && query && filteredPeople.length === 0 && (
        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
