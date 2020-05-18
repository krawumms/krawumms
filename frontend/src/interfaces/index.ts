// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

export type Track = {
  id: string;
  uri: string;
  name: string;
  artists: Array<{
    name: string;
  }>;
  album: {
    images: Array<{
      height: number;
      width: number;
      url: string;
    }>;
  };
};

export type Party = {
  id: string;
  name: string;
  topic: string;
  code: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};
