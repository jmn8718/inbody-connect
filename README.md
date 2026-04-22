# inbody-connect

Nodejs library to interact with InBody API.

> ⚠️ This repository is using a non-public API that could break anytime.

## Installation

```bash
npm install inbody-connect
```

## Usage

```ts
import { InBodyApi } from 'inbody-connect';

const client = new InBodyApi({
  id: 'MyId',
  password: 'MySecretPassword',
});
```

## Contributing

- Contributor guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Release process: [RELEASE.md](./RELEASE.md)

## License

[MIT License](./LICENSE.md)
