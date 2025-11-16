test("Teste de Exemplo", async () => {
  const response = await fetch(
    "http://localhost:3000/api/users?page=2&pageSize=5"
  );

  const body = await response.json();

  expect(Array.isArray(body.data)).toBeTruthy();
  expect(body.data.length).toBe(5);

  expect(body.count).toBe(30000);
  expect(body.next).toBe("http://localhost:3000/api/users?page=3&pageSize=5");
  expect(body.previous).toBe(
    "http://localhost:3000/api/users?page=1&pageSize=5"
  );
});
