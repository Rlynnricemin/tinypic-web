/*!
 * Tinycon - A small library for compress the image
 * Lynnricemin, http://tommoor.com
 * Copyright (c) 2019 Lynnricemin
 * @license MIT Licensed
 */
(function(){
    var defaults = {
        file: null, // upload image, <File> or <base64> or <canvas>
        type: 'file', // finnal result type, <File> or <base64>
        limitsize: 100 * 1024 * 1024, // Bits，default as 100kb
        callback: function(file) {
            console.info(file)
        }
    }
    var filetype = 'image/jpeg';
    function Tinypic(config) {
        /**
        *  init
        *  @param {Object} config param
        *  @param {File} config.file
        *  @param {string} config.type default file
        *  @param {number} config.limitsize default 100*1024*1024
        * **/
        for (var key in defaults) {
            config[key] = config.hasOwnProperty(key) ? config[key] : defaults[key];
        }
        this.file = config.file;
        this.type = config.type;
        this.limitsize = config.limitsize; 
        this.callback = config.callback;
        if (!checktype(config)) {
            return
        }
        getCompressFile.call(this);
        return this
    }
    
    function checktype(config) {
        var error = 0;
        var {file, type, limitsize, callback} = config;
        if (!(file instanceof File || typeof file === 'string' && ['image/jpeg', 'image/png'].indexOf(file.type))) {
            console.warn('typeof File is incorrect');
            error = 1;
        }
        if (['file', 'base64'].indexOf(type) === -1) {
            console.warn('type isnt exits');
            error = 1;
        }
        filetype = file.type
        if (typeof limitsize !== 'number') {
            console.warn('limitsize should be number');
            error = 1;
        }
        if (typeof callback !== 'function') {
            console.warn('callback should be function');
            error = 1;
        }
        return error ? false : true;
    }
    // compress picture
    function getCompressFile(file, canvassize) {
        file = file ? file : this.file;
        var size = 0;
        var comSize = 1;
        var newimg = new Image();
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        if (file instanceof File) {
            size = file.size
            if (size <= this.limitsize) {
              comSize = 1
              if (this.type === 'file') {
                this.callback(file)
                return
              }
            } else {
              comSize = Math.sqrt(this.limitsize / size)
            }
            var _reader = new FileReader();
            _reader.readAsDataURL(file);
            _reader.onload = () => {
              newimg.src = _reader.result;
            }
        } else {
            comSize = Math.sqrt(this.limitsize / canvassize)
            newimg.src = file.toDataURL(filetype);
        }
        newimg.onload = () => {
            canvas.width = newimg.naturalWidth * comSize;
            canvas.height = newimg.naturalHeight * comSize;
            ctx.drawImage(newimg, 0, 0, newimg.naturalWidth * comSize , newimg.naturalHeight * comSize );
            var mindata = canvas.toDataURL(filetype);
            var resultdatamore = coverBase64ToBlob.call(this, mindata.replace('data:' + filetype + ';base64,', ''))
            if (!resultdatamore.result) {
                getCompressFile.call(this, canvas, resultdatamore.data)
            } else {
                var resdata = this.type === 'file'? resultdatamore.data : resultdatamore.base64
                var image = new Image()
                image.src = resdata
                this.callback(resdata)
            }
        }
    }

    // computed File Size
    function coverBase64ToBlob (base64string) {
        var imagedata = window.atob(base64string)
        var _ia = new Uint8Array(imagedata.length)
        for (var i = 0; i < imagedata.length; i++) {
            _ia[i] = imagedata.charCodeAt(i)
        }
        if (_ia.length < this.limitsize) {
            return {'result': true, 'data': new File([_ia], this.file.name, {type: filetype}), 'base64': 'data:' + filetype + ';base64,' + base64string}
        } else {
            return {'result': false, 'data': _ia.length}
        }
    }

    // export results
    if(typeof define === 'function' && define.amd) {
        define(Tinypic);
    } else if (typeof module !== 'undefined') {
        module.exports = Tinypic;
    } else {
        window.Tinypic = Tinypic;
    }
}())