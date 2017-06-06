import * as file2html from 'file2html/lib/index';
import bytesToString from 'file2html/lib/bytes-to-string';

export const pngMimeType: string = 'image/png';

const supportedMimeTypes: string[] = [
    'image/gif',
    'image/jpg',
    'image/jpeg',
    'image/pjpeg',
    'image/svg+xml',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    pngMimeType
];

export default class ImageReader extends file2html.Reader {
    read ({fileInfo}: file2html.ReaderParams) {
        const {content} = fileInfo;
        const {byteLength} = content;
        const meta: file2html.FileMetaInformation = Object.assign({
            fileType: file2html.FileTypes.image,
            mimeType: '',
            name: '',
            size: byteLength,
            creator: '',
            createdAt: '',
            modifiedAt: ''
        }, fileInfo.meta);

        if (meta.mimeType.indexOf('svg') >= 0) {
            meta.fileType = file2html.FileTypes.drawing;
        }

        const base64: string = btoa(bytesToString(content));

        return Promise.resolve(new file2html.File({
            meta: meta,
            styles: '<style></style>',
            content: `<img src="data:${ meta.mimeType };base64,${ base64 }" alt="${ meta.name || '' }"/>`
        }));
    }

    static testFileMimeType (mimeType: string) {
        return supportedMimeTypes.indexOf(mimeType) >= 0;
    }
}