## Zadanie

- zrobić forka tego repozytorium do swojego gh,
- utworzyć w terminalu bazę danych oraz tabelę `users` z 6 kolumnami:

| id  | firstName | lastName | email | address | city |
| --- | --------- | -------- | ----- | ------- | ---- |
|     |           |          |       |         |      |

- kolumna `id` ma się automatycznie numerować przy dodawaniu kolejnych użytkowników
- podpiąć się w naszej aplikacji pod lokalnie postawioną (w terminalu) postgresową bazę danych
- napisać zapytanie do tworzenia użytkownika
- dodać 5 użytkowników używając `POST` w [postmanie](https://www.postman.com/) wykorzystując odpowiedni route oraz napisane w poprzednim kroku zapytanie
- napisać zapytanie do _edycji_ oraz _usuwania_ użytkownika
- zmienić dane w postmanie (`PUT`) wybranego użytkownika oraz usunąć (`DELETE`) innego wybranego użytkownika
- wystawić _pull request_: branch na forku -> branch master w tym repozytorium

Zadanie z \* (ty nie zrobisz ?!):

- utworzyć w terminalu w naszej bazie danych nową tabelę `cities`:

| id  | city | country | population |
| --- | ---- | ------- | ---------- |
|     |      |         |            |

- dodać mechanizm, by zapytanie `http://localhost:3000/users?city-details=true` zwracało w odpowiedzi JSON wraz ze szczegółami miasta

```
{
    "data": [
        {
            "id": 1,
            "firstName": "Jan",
            "lastName": "Kowalski",
            "email": "kowalskiii@example.com"
            "address": "Łaciata 188/22",
            "city": {
              name: "Warszawa",
              country: "Poland",
              population: 1783321
            },
        },
...
    ]
}
```
