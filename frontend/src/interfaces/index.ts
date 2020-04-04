// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

export type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export type Party = {
  id: number;
  name: string;
};
