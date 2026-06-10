// Datos en memoria — reemplazar con DB real
let items = [
  { id: 1, name: 'Ejemplo 1' },
  { id: 2, name: 'Ejemplo 2' },
];
let nextId = 3;

const getAll = () => items;

const getById = (id) => items.find((i) => i.id === id);

const create = (data) => {
  const newItem = { id: nextId++, ...data };
  items.push(newItem);
  return newItem;
};

const update = (id, data) => {
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...data };
  return items[index];
};

const remove = (id) => {
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  return items.splice(index, 1)[0];
};

module.exports = { getAll, getById, create, update, remove };
