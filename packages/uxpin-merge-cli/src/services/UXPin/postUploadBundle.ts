// tslint:disable-next-line:import-name
import fetch from 'cross-fetch';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';
import { parseJson } from '../../utils/fetch/parseJson';
import { getAuthHeaders } from './headers/getAuthHeaders';
import { getUserAgentHeaders } from './headers/getUserAgentHeaders';

export async function postUploadBundle(domain:string, token:string, commitHash:string, path:string):Promise<any> {
  const body:FormData = new FormData();

  body.append('commitHash', commitHash);
  body.append('bundle', createReadStream(path));

  return fetch(`${domain}/code/v/1.0/push/bundle`, {
    body: body as unknown as ReadableStream, // TODO: figure out what's wrong with types
    headers: {
      ...getAuthHeaders(token),
      ...await getUserAgentHeaders(),
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
  })
    .then((response:Response) => parseJson(response));
}
