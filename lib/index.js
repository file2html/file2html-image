"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var file2html = require("file2html/lib/index");
exports.pngMimeType = 'image/png';
var supportedMimeTypes = [
    'image/gif',
    'image/jpg',
    'image/jpeg',
    'image/pjpeg',
    'image/svg+xml',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    exports.pngMimeType
];
/**
 * @param {Uint8Array} bytes
 * @returns {string}
 */
function bytesToString(bytes) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
    var QUANTUM = 32768;
    var length = bytes.length;
    var result = '';
    for (var i = 0; i < length; i += QUANTUM) {
        result += String.fromCharCode.apply(null, bytes.slice(i, i + QUANTUM));
    }
    return result;
}
var ImageReader = (function (_super) {
    __extends(ImageReader, _super);
    function ImageReader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageReader.prototype.read = function (_a) {
        var fileInfo = _a.fileInfo;
        var content = fileInfo.content;
        var byteLength = content.byteLength;
        var meta = Object.assign({
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
        var base64 = btoa(bytesToString(content));
        return Promise.resolve(new file2html.File({
            meta: meta,
            styles: '<style></style>',
            content: "<img src=\"data:" + meta.mimeType + ";base64," + base64 + "\" alt=\"" + (meta.name || '') + "\"/>"
        }));
    };
    ImageReader.testFileMimeType = function (mimeType) {
        return supportedMimeTypes.indexOf(mimeType) >= 0;
    };
    return ImageReader;
}(file2html.Reader));
exports.default = ImageReader;
