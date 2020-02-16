function renderTable(data) {
  const exclude = ['createdAt', 'updatedAt'];

  const table = document.querySelector('table');

  while (table.firstChild) {
    table.firstChild.remove();
  }

  const header = document.createElement('tr');
  table.prepend(header);

  data.forEach((user, i) => {
    const row = document.createElement('tr');
    table.appendChild(row);

    Object.entries(user).forEach(([key, value]) => {
      if (exclude.includes(key)) {
        return;
      }

      if (i === 0) {
        const cell = document.createElement('th');
        cell.innerText = key;
        header.appendChild(cell);
      }

      const cell = document.createElement('td');
      cell.innerText = value;
      row.appendChild(cell);
    });
  });

  document.querySelectorAll('tr').forEach(row => {
    if (row === header) {
      return;
    }

    const cell = document.createElement('td');
    const button = document.createElement('button');
    button.innerText = 'Usuń';
    cell.appendChild(button);
    const id = row.querySelector('td').innerText;
    button.addEventListener('click', () => {
      deleteUser(id);
    });
    row.appendChild(cell);
  });
}

function deleteUser(index) {
  fetch(`./api/users/${index}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(({ data }) => renderTable(data));
}

async function postData(event) {
  event.preventDefault();
  const dataToPost = {
    lastname: lastname.value,
    firstname: firstname.value,
    address: address.value,
    city: city.value,
    email: email.value,
  };
  const response = await fetch('./api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToPost),
  });
  const { data } = await response.json();
  renderTable(data);
}

fetch('./api/users')
  .then(res => res.json())
  .then(({ data }) => renderTable(data));

document.querySelector('form').addEventListener('submit', postData);
