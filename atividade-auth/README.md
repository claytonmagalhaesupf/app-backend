# Desafio Auth — Atividade de Fixação

Mini atividade em HTML + CSS + JavaScript puro para revisar o fluxo de autenticação da API.

## Como abrir

Basta abrir `index.html` no navegador.

Também pode ser colocado dentro do repositório da turma em uma pasta como:

```text
atividade-auth/
├── index.html
├── style.css
└── app.js
```

## Fluxo da atividade

1. Aluno informa nome e matrícula.
2. Clica em **Iniciar atividade**.
3. Recebe os cartões embaralhados.
4. Arrasta todos para **Seu fluxo** na ordem correta.
5. Para cada cartão, informa:
   - arquivo;
   - intervalo de linhas.
6. Clica em **Validar**.
7. O sistema mostra somente:
   - `✅ Correto`
   - `❌ Incorreto`

Não mostra gabarito nem qual item está errado.

## Ajustar o gabarito

Abra `app.js` e procure por:

```js
const CARDS = [
```

Cada cartão possui:

```js
{
  id: "...",
  text: "...",
  order: 1,
  file: "src/auth/auth.service.ts",
  minLine: 12,
  maxLine: 21
}
```

Como números de linha podem mudar conforme o código do projeto é formatado ou alterado,
ajuste `minLine` e `maxLine` para corresponder ao repositório real usado em aula.

A validação de linhas é tolerante: qualquer intervalo informado pelo aluno que toque
no intervalo correto é aceito.
