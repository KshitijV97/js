export type FolderStructure = {
  id: number;
  name: string;
  isFolder: boolean;
  items: Array<FolderStructure>;
};

export const explorer: FolderStructure = {
  id: 1,
  name: "root",
  isFolder: true,
  items: [
    {
      id: 2,
      name: "public",
      isFolder: true,
      items: [
        {
          id: 3,
          name: "public nested 1",
          isFolder: true,
          items: [
            {
              id: 4,
              name: "index.html",
              isFolder: false,
              items: [],
            },
            {
              id: 5,
              name: "hello.html",
              isFolder: false,
              items: [],
            },
          ],
        },
        {
          id: 6,
          name: "public nested 1 partner",
          isFolder: false,
          items: [],
        },
      ],
    },
    {
      id: 7,
      name: "src",
      isFolder: true,
      items: [
        {
          id: 8,
          name: "components",
          isFolder: true,
          items: [],
        },
        {
          id: 9,
          name: "utils",
          isFolder: true,
          items: [],
        },
      ],
    },
  ],
};
