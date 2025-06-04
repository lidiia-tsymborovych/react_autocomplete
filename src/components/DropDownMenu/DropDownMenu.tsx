import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
};

export const DropDownMenu: React.FC<Props> = ({ people, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
            onClick={() => onSelect(person)}
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
        ))}
      </div>
    </div>
  );
};
