# Daily Diet API

O Daily Diet é uma aplicação criada para facilitar o usuário que está fazendo uma dieta. Com ela, o usuário poderá ter controle sobre as refeições feitas 
e verificar a quantidade de refeições que estão dentro da dieta ou não, possibilitando assim fazer uma análise sobre suas refeições.

## Sobre o projeto

Essa aplicação tem também como um dos seus objetivos a prática de tecnologias como Knex, TypeScript, Bcrypt, testes E2E (End-to-End) e uso de cookies.
<br/>

### Tecnologias
- Node
- Fastify
- Knex
- SQLite
- Vitest
- Supertest


### Funcionalidades

### :bust_in_silhouette: Usuário

&nbsp;O usuário é composto por: nome, email, senha, altura e peso.
    
- Não pode ser criado um usuário com email já em uso.

- A senha é criptografada usando a biblioteca Bcrypt.

- Altura e peso são necessários para o cálculo do IMC.

- Após se cadastrar, o usuário deve criar uma sessão (login) com email e senha, onde será validado e salvo o ID em um cookie.
Todas as funcionalidades a partir daqui só funcionam se houver esse ID, caso contrário, um erro 401 Unauthorized será retornado.

- O usuário pode ver seus dados.
- O usuário pode atualizar seus dados.
- Não pode ser atualizado um usuário com email já em uso por outro usuário.
- O usuário pode apagar sua conta.

<br/>

### :fork_and_knife: Refeições
&nbsp;A refeição é composta por: nome, descrição, data e está na dieta.
 
- Não pode ser criada uma refeição com todos os parâmetros iguais a uma refeição já existente.

- Podem ser listadas todas as refeições do usuário.
  
- A refeição pode ser exibida.
  
- A refeição pode ser atualizada.
  
- A refeição pode ser deletada.

- O usuário só pode ver, criar, listar e atualizar refeições que ele mesmo criou.

<br/>

### :scroll: Resumo do usuário

&nbsp;No resumo, serão listadas algumas métricas:

- Total de refeições.
- Total de refeições na dieta.
- Total de refeições que não estão na dieta.
- Maior sequência de refeições dentro da dieta.
- Mostra o IMC do usuário, o número e a categoria na qual se enquadra.

<br/>

## Rotas

### :bust_in_silhouette: Users

| Método | Rota                         | Descrição                              |
|--------|------------------------------|----------------------------------------|
| POST   | `/users`                     | Cria um novo usuário                   |
| GET    | `/users/:id`                 | Obtém um usuário específico            |
| PUT    | `/users/:id`                 | Atualiza o nome e email de um usuário  |
| DELETE | `/users/:id`                 | Deleta um usuário                      |
| PATCH  | `/users/:id/password`        | Atualiza a senha de um usuário         |
| PATCH  | `/users/:id/heightAndWeight` | Atualiza o peso e altura de um usuário |

<br/>

### :clock3: Sessão

| Método | Rota                         | Descrição                            |
|--------|------------------------------|--------------------------------------|
| POST   | `/session`                   | Cria uma nova sessão                 |
| DELETE | `/session/signOut`           | Deleta uma sessão                    |

<br/>

### :fork_and_knife: Refeições

| Método | Rota                         | Descrição                               |
|--------|------------------------------|-----------------------------------------|
| POST   | `/meals`                     | Cria uma nova refeição                  |
| GET    | `/meals`                     | Lista todas as refeições                |
| GET    | `/meals/summary`             | Lista o resumo das refeições do usuário |
| GET    | `/meals/:id`                 | Obtém uma refeição específica           |
| PUT    | `/meals/:id`                 | Atualiza uma refeição                   |
| DELETE | `/meals/:id`                 | Deleta uma refeição                     |

<br/>

## Teste automatizados E2E

### :bust_in_silhouette: User

#### &nbsp;Create user
- Should be able to create a new user.
- Should not be able to create a new user if already exists.

#### &nbsp;Show user
- Should be able to show user.
- Should not be able to show user if user doesnt exist.
- Should not be able to show user without cookie userId.

#### &nbsp;Update user
- Should not be able to update user if  user doesnt exist.
- Should be able to update user.

#### &nbsp;Update user password
- Should be able to update user password
- Should not be able to update user password if cookie userId is invalid.

#### &nbsp;Update user height and weight
- Should be able to update user height and weight.
- Should not be able to update user height and weight if cookie userId is invalid.
- Should not be able to update user if  user doesnt exist.

#### &nbsp;Delete user
- Should not be able to delete user if  user doesnt exist.
- Should be able to delete user.
  
<br/>

### :clock3: Session

#### &nbsp;Create session
- Should be able to create a new session.
- Should not be able to create a new session with wrong password.
- Should not be able to create a new session with wrong email.

<br/>

### :fork_and_knife: Meal

#### &nbsp;Create meal
- Should not be able to create a new meal without cookie userId.
- Should not be able to create a new meal without userId.
- Should be able to create a new meal.
- Should not be able to create a new meal if meal already exists.

#### &nbsp;List meal
- Should not be able to list meals by another user.
- Should be able to list meals.

#### &nbsp;Show meal
- Should not be able to show meal if meal doesnt exist
- Should be able to show meals.

#### &nbsp;Update meal
- Should not be able to show meal if meal doesnt exist.
- Should be able to update a meal.

#### &nbsp;Delete meal
- Should not be able to delete meal if meal doesnt exist.
- Should be able to delete meal.
  
<br/>

### :scroll: Summary

#### &nbsp;Show summary
- Should be able to show the summary.
- Should not be able to show the summary without cookie userId.

<br/>

## Como executar?

Faça o clone do repositório.
  ```bash
  git clone https://github.com/DanielFerCoe/daily-diet-api.git
```

Instalar as depêndencias do projeto.
  ```bash
 npm i
```

Rodar as migrations do knex para criação das tabelas no banco de dados.
  ```bash
 npm run knex -- migrate:latest
```

Executar o projeto em ambiente de desenvolvimento.
  ```bash
 npm run dev
```

<br/>

## Como executar os testes?
Teste E2E User.
  ```bash
 npm run test-user
```

Teste E2E Session.
  ```bash
 npm run test-session
```

Teste E2E Meal.
  ```bash
 npm run test-meal
```

Teste E2E Summary.
  ```bash
 npm run test-summary
```
