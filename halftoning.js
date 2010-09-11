
/**
 * ハーフトーニング
 */
function Halftoning(ditherType) {
    var height = 256;
    var width = 256;
    var canvas;

    if ( ditherType == 0 ) {
        canvas = document.getElementById("myCanvas2");
    } else {
        canvas = document.getElementById("myCanvas");
    }

    var context = canvas.getContext("2d");
    var imgObj = new Image(width, height);
    imgObj.src = "http://jstap.web.fc2.com/test/html5/halftoning/lena.png";
    context.drawImage(imgObj, 0, 0);

    /* グレースケール */
    var grayImage = ToGrayscale(canvas, height, width);

    var ditherImage;
    switch ( ditherType ) {
        case 0:
            /* 濃度パターン法を用いたハーフトーニング */
            ditherImage = Halftoning_DensityPatternMethod(grayImage, height, width);

            /* canvasに表示 */
            for (var y = 0; y < height * 4; y++) {
                for (var x = 0; x < width * 4; x++) {
                    var I = ditherImage[y * (width * 4) + x];
                    setPixel(canvas, x, y, I, I, I, 255);
                }
            }
            break;

        case 1:
            /* ディザ法を用いたハーフトーニング */
            ditherImage = Halftoning_DitherMethod(grayImage, height, width);

            /* canvasに表示 */
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var I = ditherImage[y * width + x];
                    setPixel(canvas, x, y, I, I, I, 255);
                }
            }
            break;

        case 2:
            /* 誤差拡散法を用いたハーフトーニング */
            ditherImage = Halftoning_ErrorDiffusionMethod(grayImage, height, width);

            /* canvasに表示 */
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var I = ditherImage[y * width + x];
                    setPixel(canvas, x, y, I, I, I, 255);
                }
            }
            break;
    }
}

/**
 * 濃度パターン法
 */
function Halftoning_DensityPatternMethod(grayImage, height, width) {
    var newHeight = height * 4;
    var newWidth = width * 4;
    var result = new Array(newHeight * newWidth);

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var pixel = grayImage[y * width + x];

            /* 0から16まで正規化 */
            var normalizePixel = Math.floor(pixel * (16 / 255));

            var pattern;
            switch ( normalizePixel ) {
                case 0:
                    pattern = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                    break;
                case 1:
                    pattern = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0);
                    break;
                case 2:
                    pattern = new Array(0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0);
                    break;
                case 3:
                    pattern = new Array(0, 0, 255, 0, 0, 0, 0, 0, 255, 0, 255, 0, 0, 0, 0, 0);
                    break;
                case 4:
                    pattern = new Array(0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 255, 0, 0, 0, 0, 0);
                    break;
                case 5:
                    pattern = new Array(0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 255, 0, 0, 0, 0, 255);
                    break;
                case 6:
                    pattern = new Array(0, 0, 255, 0, 0, 255, 0, 255, 255, 0, 255, 0, 0, 0, 0, 255);
                    break;
                case 7:
                    pattern = new Array(0, 0, 255, 0, 0, 255, 0, 255, 255, 0, 255, 0, 0, 255, 0, 255);
                    break;
                case 8:
                    pattern = new Array(0, 255, 255, 0, 0, 255, 0, 255, 255, 0, 255, 0, 0, 255, 0, 255);
                    break;
                case 9:
                    pattern = new Array(0, 255, 255, 0, 0, 255, 0, 255, 255, 0, 255, 255, 0, 255, 0, 255);
                    break;
                case 10:
                    pattern = new Array(0, 255, 255, 255, 0, 255, 0, 255, 255, 0, 255, 255, 0, 255, 0, 255);
                    break;
                case 11:
                    pattern = new Array(0, 255, 255, 255, 0, 255, 0, 255, 255, 255, 255, 255, 0, 255, 0, 255);
                    break;
                case 12:
                    pattern = new Array(0, 255, 255, 255, 255, 255, 0, 255, 255, 255, 255, 255, 0, 255, 0, 255);
                    break;
                case 13:
                    pattern = new Array(0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 255, 0, 255);
                    break;
                case 14:
                    pattern = new Array(0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 255, 255, 255);
                    break;
                case 15:
                    pattern = new Array(0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255);
                    break;
                case 16:
                    pattern = new Array(255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255);
                    break;
            }

            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    result[(y * 4 + i) * newWidth + (x * 4 + j)] = pattern[i * 4 + j];
                }
            }
        }
    }
    return result;
}

/**
 * ディザ法
 */
function Halftoning_DitherMethod(grayImage, height, width) {
    var result = new Array(height * width);

    var bayerPattern = new Array(
        0, 8, 2, 10,
        12, 4, 14, 6,
        3, 11, 1, 9,
        15, 7, 13, 5
    );

    var divHeight = Math.floor(height / 4);
    var divWidth = Math.floor(width / 4);

    for (var y = 0; y < divHeight; y++) {
        for (var x = 0; x < divWidth; x++) {
            result = DitherBlockProcess(grayImage, result, bayerPattern, height, width, 4, 4, y, x);

        }
    }

    var modHeight = height % 4;
    var modWidth = width % 4;

    /* 右端 */
    for (var y = 0; y < divHeight; y++) {
        result = DitherBlockProcess(grayImage, result, bayerPattern, height, width, 4, modWidth, y, divWidth * 4 - 1);
    }

    /* 下端 */
    for (var x = 0; x < divWidth; x++) {
        result = DitherBlockProcess(grayImage, result, bayerPattern, height, width, modHeight, 4, divHeight * 4 - 1, x);
    }

    /* 右下端 */
    result = DitherBlockProcess(grayImage, result, bayerPattern, height, width, modHeight, modWidth, divHeight * 4 - 1, divWidth * 4 - 1);

    return result;
}

/**
 * ディザ法によって1ブロックを2値化する
 */
function DitherBlockProcess(inputImage, outputImage, pattern, height, width, blockHeight, blockWidth, y, x) {

    for (var i = 0; i < blockHeight; i++) {
        for (var j = 0; j < blockWidth; j++) {
            if ( inputImage[(y * blockHeight + i) * width + (x * blockWidth + j)] >= pattern[i * blockWidth + j] * 16 + 8 ) {
                outputImage[(y * blockHeight + i) * width + (x * blockWidth + j)] = 255;
            } else {
                outputImage[(y * blockHeight + i) * width + (x * blockWidth + j)] = 0;
            }
        }
    }
    return outputImage;
}

/**
 * 誤差拡散法 (Floyd-Steinberg 法)
 */
function Halftoning_ErrorDiffusionMethod(grayImage, height, width) {
    var tempImage = grayImage;
    var result = new Array(height * width);

    for ( var y = 0; y < height; y++ ) {
        for ( var x = 0; x < width; x++ ) {
            var f = tempImage[y * width + x];
            var e;

            if ( f > 127 ) {
                e = f - 255;
                f = 255;

            } else {
                e = f;
                f = 0;
            }

            result[y * width + x] = f;

            /* 誤差をばら撒く */
            if( x != width - 1 )
                tempImage[y * width + x + 1] += Math.floor((7 / 16) * e);

            if( (x != 0) && (y != height - 1) )
                tempImage[(y + 1) * width + x - 1] += Math.floor((3 / 16) * e);

            if( y != height - 1 )
                tempImage[(y + 1) * width + x] += Math.floor((5 / 16) * e);

            if (x != width - 1 && y != height - 1)
                tempImage[(y + 1) * width + x + 1] += Math.floor((1 / 16) * e);

        }
    }

    return result;
}

/**
 * グレースケール
 */
function ToGrayscale(canvas, height, width) {
    var grayImage = new Array(width * height);

    for(var y = 0; y < height; y++){
        for(var x = 0; x < width; x++){
            var pixelData = getPixel(canvas, x, y);
            var R = pixelData.R;
            var G = pixelData.G;
            var B = pixelData.B;

            R = Math.floor(R * 0.299);
            G = Math.floor(G * 0.587);
            B = Math.floor(B * 0.114);

            grayImage[y * width + x] = R + G + B;
        }
    }

    return grayImage;

}

function getPixel(srcCanvas, x, y){
    if (window.opera) {
        var gContext = srcCanvas.getContext("opera-2dgame");
        var rgbStr = gContext.getPixel(x, y); // ?s?N?Z???l???擾????
        var R = eval("0x"+rgbStr.substring(1,3));
        var G = eval("0x"+rgbStr.substring(3,5));
        var B = eval("0x"+rgbStr.substring(5,7));
        return {R:R, G:G, B:B};
    }

    var imagePixelData = srcCanvas.getContext("2d").getImageData(x, y, 1, 1).data;
    var R = imagePixelData[0];
    var G = imagePixelData[1];
    var B = imagePixelData[2];
    return {R:R, G:G, B:B};
}

function setPixel(srcCanvas, x, y, R, G, B, A){
    if (window.opera) {
        var gContext = srcCanvas.getContext("opera-2dgame");
        var rgbaColor = "rgba("+R+","+G+","+B+","+A+")";
        gContext.setPixel(x,y, rgbaColor);
        return;
    }
    var context = srcCanvas.getContext("2d");
    var pixelImage = context.createImageData(1, 1);
    pixelImage.data[0] = R;
    pixelImage.data[1] = G;
    pixelImage.data[2] = B;
    pixelImage.data[3] = A;
    context.putImageData(pixelImage, x, y);
}
