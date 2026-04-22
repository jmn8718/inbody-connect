import type { InBodyCredentials } from './types';

export default class InBodyApi {
  private _credentials: InBodyCredentials;

  constructor(credentials: InBodyCredentials) {
    if (!credentials) {
      throw new Error('Missing credentials');
    }
    this._credentials = credentials;
  }
}
