import { ensureDir, mkdir, readdir, writeJson } from 'fs-extra';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import { join, parse, ParsedPath } from 'path';
import { collectUrlEncodedFormData } from '../../common/form/collectUrlEncodedFormData';
import { getAccessControlHeaders } from '../../headers/getAccessControlHeaders';
import { ExperimentationServerContext } from '../../startExperimentationServer';
import { handleImplementationError } from '../error/handleImplementationError';
import { ParsedFormData } from '../page/save/PageSaveHandler';
import { RequestHandler } from '../RequestHandler';
import { getUploadMetadataPath } from './getUploadMetadataPath';

export const UPLOAD_DIR_NAME:string = 'user-upload';
export const UPLOAD_METADATA_FILE_NAME:string = 'upload-metadata.json';

export class PrepareUploadHandler implements RequestHandler {

  constructor(private context:ExperimentationServerContext) {
  }

  public handle(request:IncomingMessage, response:ServerResponse):void {
    this.handlePrepareUpload(request, response).catch((error) => handleImplementationError(response, error));
  }

  private async handlePrepareUpload(request:IncomingMessage, response:ServerResponse):Promise<void> {
    const formData:ParsedFormData = await collectUrlEncodedFormData(request);
    const requestPayload:PrepareUploadFormData = JSON.parse(formData.json);
    const fileId:string = await this.createFileId();
    await this.writeMetadata(fileId, requestPayload);
    const responseBody:string = JSON.stringify(await this.getResponseData(fileId, requestPayload));
    response.writeHead(OK, {
      'Content-Type': 'text/xml; charset=utf-8',
      ...getAccessControlHeaders(this.context.uxpinDomain),
    });
    response.end(responseBody);
  }

  private async getResponseData(fileId:string, uploadDetails:PrepareUploadFormData):Promise<PrepareUploadResponse> {
    const parsedName:ParsedPath = parse(uploadDetails.file_name);
    return {
      file_data: {
        extension: parsedName.ext.split('.')[1],
        id_stored_file: fileId,
        id_tree: '1',
        name: parsedName.name,
        original_name: uploadDetails.file_name,
        path: `${fileId}/`,
        resolution: uploadDetails.resolution,
        size: uploadDetails.file_size,
        type: uploadDetails.file_type,
      },
      final_url: this.getFinalFileUrl(fileId),
      id_stored_file: fileId,
      message: '',
      params: {
        path: `${fileId}/${uploadDetails.file_name}`,
      },
      status: true,
      upload_url: this.getUploadUrl(),
    };
  }

  private getFinalFileUrl(fileId:string):string {
    const { port } = this.context;
    return `http://localhost:${port}/upload/file?id=${fileId}`;
  }

  private getUploadUrl():string {
    const { port } = this.context;
    return `http://localhost:${port}/upload`;
  }

  private async createFileId():Promise<string> {
    const uploadDirPath:string = join(this.context.uxpinDirPath, UPLOAD_DIR_NAME);
    await ensureDir(uploadDirPath);
    const dirContents:string[] = await readdir(uploadDirPath);
    const dirContentsAsNumbers:number[] = dirContents.map((n) => parseInt(n, 10));
    const newId:string = (Math.max(0, ...dirContentsAsNumbers) + 1).toString();
    await mkdir(join(uploadDirPath, newId));
    return newId;
  }

  private async writeMetadata(fileId:string, uploadDetails:PrepareUploadFormData):Promise<void> {
    const metadata:UploadItemMetadata = {
      contentType: uploadDetails.file_type,
      fileName: uploadDetails.file_name,
    };
    const metadataPath:string = getUploadMetadataPath(this.context.uxpinDirPath, fileId);
    await writeJson(metadataPath, metadata);
  }

}

export type DMSBool = 1 | 0;

export interface PrepareUploadFormData {
  add_to_library:DMSBool;
  directory_id:DMSBool;
  file_name:string;
  file_size:number;
  file_type:string;
  id_collection:number;
  no_redirect:DMSBool;
  overwrite:DMSBool;
  resolution:string;
}

export interface UploadFileParams {
  path:string;
}

export interface PrepareUploadResponse {
  file_data:PrepareUploadResponseFileData;
  final_url:string;
  id_stored_file:string;
  message:string;
  params:UploadFileParams;
  status:boolean;
  upload_url:string;
}

export interface PrepareUploadResponseFileData {
  extension:string;
  id_stored_file:string;
  id_tree:string;
  name:string;
  original_name:string;
  path:string;
  resolution:string;
  size:number;
  type:string;
}

export interface UploadItemMetadata {
  contentType:string;
  fileName:string;
}
