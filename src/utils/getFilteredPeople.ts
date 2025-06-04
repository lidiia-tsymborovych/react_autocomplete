import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

export const getFilteredPeople = (query: string) => {
  const normalQuery = query.trim().toLowerCase();

  return peopleFromServer.filter((person: Person) => {
    const normalName = person.name.trim().toLowerCase();

    return normalName.includes(normalQuery);
  });
};
