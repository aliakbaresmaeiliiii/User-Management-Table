interface Person {
  name: string;
  age: number;
}

self.onmessage = (event: MessageEvent<{ list: Person[]; query: string }>) => {
  const { list, query } = event.data;
  const q = query.trim().toLowerCase();
  if (!q) {
    self.postMessage(list);
    return;
  }
  const filtered = list
    .filter((person) => {
      const nameMatches = person.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const ageMatches = person.age.toString().includes(query);
      return nameMatches || ageMatches;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  self.postMessage(filtered);
};
