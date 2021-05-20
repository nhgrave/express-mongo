module.exports = [
  {
    id: "query1",
    title: "Consulta 1",
    description: "Get all projects open",
    collection: 'project', // FROM
    query: [
      { $match: { // WHERE
        status: "open"
      } }
    ]
  },
  {
    id: "query2",
    title: "Consulta 2",
    description: "Get all projects done",
    collection: 'project', // FROM
    query: [
      { $match: { // WHERE
        status: "done"
      } }
    ]
  }
];
