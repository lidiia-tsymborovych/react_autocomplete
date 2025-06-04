import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { NoSuggestions } from './components/NoSuggestions';
import { DropDownInput } from './components/DropDownInput';
import { DropDownMenu } from './components/DropDownMenu';

export const App: React.FC = () => {
  const [filteredPeople, setFilteredPeople] =
    useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setIsOpen(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <DropDownInput
            setFilteredPeople={setFilteredPeople}
            setSelectedPerson={setSelectedPerson}
            setIsOpen={setIsOpen}
            selectedPerson={selectedPerson}
          />

          {isOpen && filteredPeople.length > 0 && (
            <DropDownMenu people={filteredPeople} onSelect={handleSelect} />
          )}
        </div>

        {filteredPeople.length === 0 && <NoSuggestions />}
      </main>
    </div>
  );
};
