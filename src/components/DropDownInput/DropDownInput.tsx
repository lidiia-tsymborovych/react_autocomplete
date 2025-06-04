import React, { useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { getFilteredPeople } from '../../utils/getFilteredPeople';
import { Person } from '../../types/Person';

type Props = {
  setFilteredPeople: (people: Person[]) => void;
  setSelectedPerson: (person: Person | null) => void;
  setIsOpen: (open: boolean) => void;
  selectedPerson: Person | null;
  delay?: number;
};

export const DropDownInput: React.FC<Props> = ({
  setFilteredPeople,
  setSelectedPerson,
  setIsOpen,
  selectedPerson,
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const lastSearchRef = useRef('');

  useEffect(() => {
    if (selectedPerson) {
      setInputValue(selectedPerson.name);
    }
  }, [selectedPerson]);

  const debouncedFilter = useMemo(() => {
    return debounce((value: string) => {
      if (value !== lastSearchRef.current) {
        lastSearchRef.current = value;
        const filtered = getFilteredPeople(value);

        setFilteredPeople(filtered);
      }
    }, delay);
  }, [delay, setFilteredPeople]);

  useEffect(() => {
    return () => {
      debouncedFilter.cancel();
    };
  }, [debouncedFilter]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputValue(value);
    setSelectedPerson(null);
    setIsOpen(true);
    debouncedFilter(value);
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (inputValue.trim() === '') {
      setFilteredPeople(getFilteredPeople(''));
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 100);
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        data-cy="search-input"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};
