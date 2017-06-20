import * as file2html from 'file2html/lib/index';

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

/**
 * @param {Uint8Array} bytes
 * @returns {string}
 */
function bytesToString (bytes: Uint8Array): string {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
    const QUANTUM: number = 32768;
    const {length} = bytes;
    let result: string = '';

    for (let i = 0; i < length; i += QUANTUM) {
        result += String.fromCharCode.apply(null, bytes.slice(i, i + QUANTUM));
    }

    return result;
}

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