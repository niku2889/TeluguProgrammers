import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
// import videojs from 'video.js';
//@ts-ignore
import { environment } from "src/environments/environment";
// import dynamicWatermark from "videojs-dynamic-watermark/dist/videojs-dynamic-watermark.es.js";
@Directive({
    selector: '[Watermark]'
})
export class WatermarkDirective implements OnInit, OnDestroy {
    watermarkText: string = 'IDVA';
    private isWatermarkApplied: boolean = false;
    constructor(private el: ElementRef) { }

    ngOnInit() {
        if (this.el.nativeElement instanceof HTMLImageElement) {
            this.applyImageWatermark();
        } else if (this.el.nativeElement instanceof HTMLVideoElement) {
            this.videoFetchHelper();
        } else {
        }
    }

    ngOnDestroy() {
        this.isWatermarkApplied = false;
    }

    private getAverageImageColor(imageData: ImageData): number {
        let totalBrightness = 0;
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const brightness = (r + g + b) / 3;

            totalBrightness += brightness;
        }

        return totalBrightness / (imageData.width * imageData.height);
    }

    private applyImageWatermark() {
        if (this.isWatermarkApplied) {
            return;
        }
        this.el.nativeElement.setAttribute('onContextMenu', 'return false;')

        const canvas = document.createElement('canvas');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = this.el.nativeElement.src;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const averageBrightness = this.getAverageImageColor(imageData);

                const text = this.watermarkText;

                let rowCount = 8;
                ctx.lineWidth = 0.4;
                let fontSize = Math.max(canvas.width, canvas.height) * 0.05;
                if (canvas.width <= 480) {
                    rowCount = 4;
                    ctx.lineWidth = 0.2;
                    fontSize = Math.max(canvas.width, canvas.height) * 0.1;
                }

                ctx.font = `${fontSize}px Arial`;

                const textColor = averageBrightness > 128 ? 'gray' : 'white';

                ctx.strokeStyle = textColor;
                ctx.textBaseline = 'middle';

                const watermarkWidth = ctx.measureText(text).width;
                const watermarkHeight = fontSize;

                const rotationAngle = -Math.PI / 6;

                const rowSpacing = (canvas.height - watermarkHeight) / (rowCount - 1);

                for (let row = 0; row < rowCount; row++) {
                    for (let x = -watermarkWidth; x < canvas.width; x += watermarkWidth * 1.5) {
                        const y = row * rowSpacing - watermarkHeight / 2;
                        ctx.save();
                        ctx.translate(x + watermarkWidth / 2, y + watermarkHeight / 2);
                        ctx.rotate(rotationAngle);
                        ctx.strokeText(text, -watermarkWidth / 2, -watermarkHeight / 2);
                        ctx.restore();
                    }
                }

                this.el.nativeElement.src = canvas.toDataURL();

                // if (this.el.nativeElement.parentElement instanceof HTMLAnchorElement) {
                //     this.el.nativeElement.parentElement.href = canvas.toDataURL();
                // }

                this.isWatermarkApplied = true;
            }
        };
    }

    // private applyVideoWatermark() {
    //     this.el.nativeElement.classList.add('video-js', 'vjs-default-skin', 'vjs-big-play-centered');
    //     const src = this.el.nativeElement.src

    //     const player = videojs(this.el.nativeElement);
    //     videojs.registerPlugin('dynamicWatermark', dynamicWatermark);

    //     player.src({
    //         src: src + '#.mp4',
    //         type: 'video/mp4'
    //     })

    //     player.ready(() => {
    //         //@ts-ignore
    //         player.dynamicWatermark({
    //             elementId: player.id() + '_watermark',
    //             watermarkText: this.watermarkText,
    //             changeDuration: 1000,
    //             cssText:
    //                 `display: inline-block;
    //                 color: transparent;
    //                 background-color: transparent;
    //                  -webkit-text-fill-color: none;
    //                  -webkit-text-stroke-width: 1px;
    //                   -webkit-text-stroke-color: gray;
    //                 font-size: 5rem;
    //                 z-index: 9999;
    //                 position: absolute;
    //                 @media only screen and (max-width: 992px){font-size: 0.8rem;}`,
    //         });

    //         setTimeout(() => {
    //             //@ts-ignore
    //             player.dynamicWatermark({
    //                 elementId: player.id() + '_watermark2',
    //                 watermarkText: this.watermarkText,
    //                 changeDuration: 1000,
    //                 cssText:
    //                     `display: inline-block;
    //                 color: transparent;
    //                 background-color: transparent;
    //                  -webkit-text-fill-color: none;
    //                  -webkit-text-stroke-width: 1px;
    //                   -webkit-text-stroke-color: white;
    //                 font-size: 5rem;
    //                 z-index: 9999;
    //                 position: absolute;
    //                 @media only screen and (max-width: 992px){font-size: 0.8rem;}`,
    //             });
    //         }, 1000)
    //     });
    // }


    private async videoFetchHelper() {
        this.el.nativeElement.preload = 'auto';
        this.el.nativeElement.controlsList = 'nodownload';

        const src = this.el.nativeElement.src;

        const bucketName = src.match(/\/b\/([^/]+)/);
        const extractedBucketName = bucketName ? bucketName[1] : null;

        const path = src.match(/\/o\/([^?]+)/);
        const extractedPath = path ? path[1] : null;

        const contentPath = `${extractedBucketName}/${extractedPath}`;

        this.el.nativeElement.src = `contentProtector?u=${contentPath}`;
    }

    /**
      *
      *
    private async fetchNextChunk(src: string, player: any) {
        // fetch(`http://localhost:5001/idva-portal-dev/us-central1/contentProtector?u=${src}`, {
        try {
            const response = await fetch(`http://localhost:5001/idva-portal-dev/us-central1/contentProtector?u=${src}`, {
                method: 'GET',
                headers: {
                    'origin': 'http://localhost:4200'
                }
            });

            const reader = response.body.getReader();
            const stream = new ReadableStream({
                async start(controller) {
                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) {
                                break;
                            }
                            controller.enqueue(value.buffer);
                        }
                        controller.close();
                    } catch (error) {
                        console.dir(error);
                    }
                },
            });

            // Create a Blob from the stream
            const blob = await new Response(stream).blob();

            // Set the video source to the decrypted Blob
            player.src({
                src: URL.createObjectURL(blob),
                type: 'video/mp4',
            });
        } catch (error) {
            console.dir(error);
        }
    }


     private hexToUint8Array(hex: string): Uint8Array {
         // Remove any spaces and convert the hex string to an array of bytes
         const hexWithoutSpaces = hex.replace(/\s+/g, '');
         const bytes = new Uint8Array(hexWithoutSpaces.length / 2);

         for (let i = 0; i < bytes.length; i++) {
             bytes[i] = parseInt(hexWithoutSpaces.substr(i * 2, 2), 16);
         }

         return bytes;
     }

     private decryptVideoData(encryptedData: ArrayBuffer) {
         const algorithm = { name: 'AES-CBC', iv: this.iv };
         crypto.subtle.importKey('raw', this.key, algorithm, false, ['decrypt'])
             .then((importedKey) => {
                 return crypto.subtle.decrypt(algorithm, importedKey, encryptedData);
             })
             .then((decryptedData) => {
                 // Convert the decrypted data to a Blob
                 const blob = new Blob([decryptedData], { type: 'video/mp4' });

                 // Display the decrypted video in the HTML5 video element
                 const player = videojs(this.el.nativeElement);
                 player.src({
                     src: URL.createObjectURL(blob),
                     type: 'video/mp4',
                 });
                 player.play();

             })
             .catch((error) => {
                 console.error('Error decrypting', error);
             });
     }

     private async playEncryptedVideo() {
         this.el.nativeElement.classList.add('video-js', 'vjs-default-skin', 'vjs-big-play-centered');
         const src = 'http://localhost:5001/idva-portal-dev/us-central1/contentProtector'

         fetch(src, {
             method: 'GET',
         })
             .then((response) => {
                 const hexIv = 'fa8290d916bdda75c4c6c44b33e27631'
                 this.iv = this.hexToUint8Array(hexIv);
                 this.key = this.hexToUint8Array('d01fe734d9d7589c31e09f9b5f0cd038800f293fe7e615ec51d63b9333c267b7')
                 return response.arrayBuffer()
             })
             .then((encryptedChunk) => {
                 // Handle each incoming encrypted chunk
                 this.decryptVideoData(encryptedChunk);
             })
             .catch((error) => {
                 console.error('Error fetching encrypted video chunk:', error);
             });
     }
      */
}
