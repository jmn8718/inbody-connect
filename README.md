# inbody-connect

Node.js library to interact with the InBody API.

> ⚠️ This repository uses a non-public API that could break at any time.

## Installation

```bash
npm install inbody-connect
```

## Usage

### Credentials at construction time

```ts
import { InBodyApi, InBodyBaseUrl } from 'inbody-connect';

const client = new InBodyApi({
  id: 'my_login_id',
  password: 'my_password',
  baseUrl: InBodyBaseUrl.Korea, // optional, defaults to Korea
});

await client.login();
```

### Credentials passed to login()

```ts
import { InBodyApi } from 'inbody-connect';

const client = new InBodyApi({ baseUrl: InBodyBaseUrl.Europe });

await client.login({ loginId: 'my_login_id', loginPw: 'my_password' });
```

## Configuration

| Option | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Login ID (can be provided to `login()` instead) |
| `password` | `string` | — | Password (can be provided to `login()` instead) |
| `baseUrl` | `string \| InBodyBaseUrl` | `InBodyBaseUrl.Korea` | API base URL |
| `timeoutMs` | `number` | `30000` | Request timeout in ms |
| `countryCode` | `string` | `'82'` | Country dialing code sent with login |
| `appVersion` | `string` | `'1.0.0'` | App version string sent with login |
| `deviceType` | `string` | `'Android'` | Device type string sent with login |

### Base URLs

```ts
import { InBodyBaseUrl } from 'inbody-connect';

InBodyBaseUrl.Korea   // https://appapikr.lookinbody.com  (default)
InBodyBaseUrl.Europe  // https://appapieur.lookinbody.com
InBodyBaseUrl.USA     // https://appapiusav2.lookinbody.com
```

## Token management

After a successful login the access and refresh tokens are stored internally.
The client will automatically attempt to refresh the access token on a `401` response
and retry the original request once.

```ts
// Manually read / set / clear tokens (e.g. to persist them between runs)
const tokens = client.getTokens();           // { accessToken, refreshToken }
client.setTokens({ accessToken, refreshToken });
client.clearTokens();

// Manually trigger a refresh
await client.refreshAccessToken();
```

## Available methods

### Auth
- `login(options?)` — log in and store tokens
- `refreshAccessToken()` — exchange refresh token for a new access token

### InBody data
- `getInBodyData({ uid, syncDatetime?, numberPerData?, currentIndex?, language? })`
- `getInBodyDataTotalCount({ uid, syncDatetimeInBody? })`
- `getInBodyBodyType({ uidDatetimes, language? })`

## Contributing

- Contributor guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Release process: [RELEASE.md](./RELEASE.md)

## License

[MIT License](./LICENSE.md)
