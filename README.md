This project is a node app which runs via AWS Lambda. It receives a webhook
from an AWS dash button and triggers generating a PR on [artsy/artsy.github.io](https://github.com/artsy/artsy.github.io)

Examples: 

- [C makes it easy for you to shoot yourself in the foot. C++ makes that harder, but when you do, it blows away your whole leg. -- Bjarne Stroustrup](https://github.com/artsy/artsy.github.io/pull/491)
- [Pournelle must die!](https://github.com/artsy/artsy.github.io/pull/490)

## How do I work on this?

```sh
git clone https://github.com/mdole/easy-pr.git
cd easy-pr
yarn install

# Open VS Code with `code .`

# Run tests
yarn jest
```

## How do I deploy this?

```sh
yarn release
```
