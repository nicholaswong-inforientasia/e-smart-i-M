import { Injectable } from '@angular/core';

@Injectable()
export class ProviderUtility {

    convertDate(date) {
        if (date !== null) {
            let d = date.split("-");
            if (d[0].length === 2)
                return d[2] + '-' + d[1] + '-' + d[0];
            else
                return date;
        }
        else
            return '';
    }

    getFileName(filePath) {
        let file = filePath.split('/');
        return file[file.length - 1];

    }

    replace(str, find, replace) {
        if (str !== null) {
            str = str.toString();
            return str.replace(new RegExp(find, 'g'), replace);
        }
        else
            return str;
    }

    generateUUID() {
        var d = new Date().getTime();
        let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);

            return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    convertToAPISafeChars(string) {
        string = this.replace(string, "/", "chrSlash");
        //string = this.replace(string, "\\", "chrBackSlash");
        string = this.replace(string, "%", "chrPercent");
        return string;
    }

    convertToDBSafeChars(string) {
        string = this.replace(string, "'", "''");
        string = this.replace(string, "#", " ");
        return string;
    }

}
