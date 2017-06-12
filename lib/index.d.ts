import * as file2html from 'file2html/lib/index';
export declare const pngMimeType: string;
export default class ImageReader extends file2html.Reader {
    read({fileInfo}: file2html.ReaderParams): Promise<file2html.File>;
    static testFileMimeType(mimeType: string): boolean;
}
