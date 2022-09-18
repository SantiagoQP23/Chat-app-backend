"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUpload = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: 'dhlfua7l7',
    api_key: '221129468146471',
    api_secret: 'Kh4v25G-hdl8OZ5RF0K5f_69QL4',
    secure: true
});
const fileUpload = (file, name) => __awaiter(void 0, void 0, void 0, function* () {
    // cloudinary.uploader.upload(file);
    try {
        const resp = yield cloudinary_1.v2.uploader.upload(file, {
            secure: true,
            public_id: name,
            folder: 'chat'
        });
        return resp.secure_url;
    }
    catch (error) {
        console.log("error", error);
        throw new Error('Error al subir la imagen');
    }
});
exports.fileUpload = fileUpload;
//# sourceMappingURL=fileUpload.js.map