
export  interface UploadEvent {
    originalEvent: Event;
    files: File[];
}


export interface  SaveUrlFileProduct{
    id:number ;
    listFile :File[] ;
}
export class File {
          id: number;  // Mettez à jour cette propriété
          name: string;
          path: string;
          type: string;
          imageData:Blob ;


    constructor(_id: number=0, _name: string="", _path: string="", _type: string="", _imageData: Blob=new Blob()) {
        this.id = _id;
        this.name = _name;
        this.path = _path;
        this.type = _type;
        this.imageData = _imageData;
    }


    get _id(): number {
        return this.id;
    }

    set _id(value: number) {
        this.id = value;
    }

    get _name(): string {
        return this.name;
    }

    set _name(value: string) {
        this.name = value;
    }

    get _path(): string {
        return this.path;
    }

    set _path(value: string) {
        this.path = value;
    }

    get _type(): string {
        return this.type;
    }

    set _type(value: string) {
        this.type = value;
    }

    get _imageData(): Blob {
        return this.imageData;
    }

    set _imageData(value: Blob) {
        this.imageData = value;
    }
}
