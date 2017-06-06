import * as fs from 'fs';
import * as path from 'path';
import ImageReader from '../../src/index';

describe('Image', () => {
    describe('#read()', () => {
        let reader: ImageReader;

        beforeEach(() => {
            reader = new ImageReader();
        });

        function testFile (filename: string, mimeType: string) {
            const fileBuffer: Buffer = fs.readFileSync(path.resolve(__dirname, '..', filename));

            return reader.read({
                fileInfo: {
                    content: new Uint8Array(fileBuffer),
                    meta: {
                        name: filename,
                        mimeType
                    } as any
                }
            }).then((file) => {
                const {styles, content} = file.getData();
                const base64: string = fileBuffer.toString('base64');

                expect(styles).toBe('<style></style>');
                expect(content).toBe(`<img src="data:${ mimeType };base64,${ base64 }" alt="${ filename }"/>`);
            });
        }

        it('should read .gif file', () => testFile('sample.gif', 'image/gif'));
        it('should read .ico file', () => testFile('sample.ico', 'image/x-icon'));
        it('should read .jpeg file', () => testFile('sample.jpeg', 'image/jpeg'));
        it('should read .jpg file', () => testFile('sample.jpg', 'image/jpg'));
        it('should read .png file', () => testFile('sample.png', 'image/png'));
        it('should read .svg file', () => testFile('sample.svg', 'image/svg+xml'));
    });
});