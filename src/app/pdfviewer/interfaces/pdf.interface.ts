export interface PDFAnnotation {
    id: number;
    linktype: string;
    uuid: string;
    type: string;
    rects?: PDFrects[];
    lines?: [string, string][];
    width?: number;
    colorid?: number;
    color: string;
    page: number;
    isTemp?: boolean;
}


export interface PDFrects {
    x: number;
    y: number;
    width: number;
    height: number;
    index?: number;
    fill?: string;
}

export interface PDFPageViewport {
    height: number;
    offsetX: number;
    offsetY: number;
    rotation: number;
    scale: number;
    transform: number[];
    viewBox: number[];
    width: number;
    rawDims: { pageHeight: number, pageWidth: number, pageX: number, pageY: number };
}

export interface iconsGroup {
    uuids: uuidGroup[],
    minY: number,
    maxY: number
}
export interface uuidGroup {
    uuid: string,
    id: number,
    linktype: string
}