import { Injectable } from '@angular/core';
import { PDFAnnotation, PDFPageViewport, PDFrects, iconsGroup, uuidGroup } from '../interfaces/pdf.interface';

@Injectable({ providedIn: 'root' })
export class PdfService {


  private readonly SVG_NS = 'http://www.w3.org/2000/svg';
  private readonly SVG = document.createElementNS(this.SVG_NS, 'svg');
  private readonly G_NODE = document.createElementNS(this.SVG_NS, 'g');
  private readonly RECT_NODE = document.createElementNS(this.SVG_NS, 'rect');
  private readonly LINE_NODE = document.createElementNS(this.SVG_NS, 'line');
  private readonly PATH_NODE = document.createElementNS(this.SVG_NS, 'path');
  private readonly foreignObject_NODE = document.createElementNS(this.SVG_NS, 'foreignObject');
  private readonly UPPER_REGEX = /[A-Z]/g;
  private readonly REGEX_HASHLESS_HEX = /^([a-f0-9]{6}|[a-f0-9]{3})$/i;
  private readonly BLACKLIST = ['viewBox'];
  private readonly isFirefox = /firefox/i.test(navigator.userAgent);

  private readonly factSvg: string = 'assets/icon/fact.svg';
  private readonly docSvg: string = 'assets/icon/doc.svg';
  private readonly webSvg: string = 'assets/icon/web.svg';
  private readonly hiltSvg: string = 'assets/img/linktype H.svg';

  // core settings
  private readonly foreignObjSize: number = 60;
  private readonly iconXmargin: number = 20;
  constructor() {

  }

  defaultSVG(): HTMLElement {
    return this.SVG.cloneNode(true) as HTMLElement;
  }

  defaultGNode(): HTMLElement {
    return this.G_NODE.cloneNode(true) as HTMLElement;
  }

  defaultRectNode(): HTMLElement {
    return this.RECT_NODE.cloneNode(true) as HTMLElement;
  }

  defaultLineNode(): HTMLElement {
    return this.LINE_NODE.cloneNode(true) as HTMLElement;
  }

  defaultPathNode(): HTMLElement {
    return this.PATH_NODE.cloneNode(true) as HTMLElement;
  }

  defaultForeignObjectNode(): HTMLElement {
    return this.foreignObject_NODE.cloneNode(true) as HTMLElement;
  }

  keyCase(key: string): string {
    if (!this.BLACKLIST.includes(key)) {
      key = key.replace(this.UPPER_REGEX, (match) => '-' + match.toLowerCase());
    }
    return key;
  }

  transform(node: any, viewport: PDFPageViewport): HTMLElement {
    const trans = this.getTranslation(viewport);
    node.setAttribute('transform', `scale(1) rotate(${viewport.rotation}) translate(${trans.x}, ${trans.y})`);
    /* if (!this.isFirefox && node.nodeName.toLowerCase() === 'svg') {
      this.adjustNodeDimensions(node, viewport);
     }*/
    return node;
  }


  getTranslation(viewport: PDFPageViewport): { x: number; y: number } {
    const { rotation, width, height, scale } = viewport;
    const rotations: { [key: number]: { x: number; y: number } } = {
      0: { x: 0, y: 0 },
      90: { x: 0, y: -width / scale },
      180: { x: -width / scale, y: -height / scale },
      270: { x: -height / scale, y: 0 },
    };
    return rotations[rotation % 360];
  }

  setAttributes(node: HTMLElement, attributes: Record<string, string | number>): void {
    Object.keys(attributes).forEach((key) => {
      node.setAttribute(this.keyCase(key), String(attributes[key]));
    });
  }

  normalizeColor(color: string): string {
    return this.REGEX_HASHLESS_HEX.test(color) ? `#${color}` : color;
  }

  /// RENDERING ANNOTATIONS
  createRect(r: PDFrects): HTMLElement {
    const rect = this.defaultRectNode();
    const attributes = { x: r.x, y: r.y, width: r.width, height: r.height, ...(r.index && { index: r.index }), ...(r.fill && { fill: r.fill }) };
    this.setAttributes(rect, attributes);
    return rect;
  }

  async renderWavyUnderline(a: PDFAnnotation): Promise<HTMLElement> {
    const path = this.defaultPathNode();
    const d: any = [];
    const amplitude = 1; // Amplitude of the wave
    const frequency = 4; // Frequency of the wave

    if (a.rects?.length) {
      a.rects.forEach(rect => {
        const { x, y, width } = rect;
        for (let i = 0; i <= width; i += 1) {
          const waveY = y + amplitude * Math.sin((i * frequency * Math.PI) / 10);
          d.push(`${i === 0 ? 'M' : 'L'}${x + i} ${waveY}`);
        }
      });
    }

    this.setAttributes(path, {
      d: d.join(' '),
      uuid: a.uuid,
      stroke: this.normalizeColor(a.color || '#000'),
      strokeWidth: a.width || 1,
      fill: 'none',
      style: 'scale:calc(var(--scale-factor) * 1)'
    });

    return path;
  }


  async renderLine(a: PDFAnnotation): Promise<HTMLElement> {
    const group = this.defaultGNode();
    const strokeColor = this.normalizeColor(a.color || '#f00');
    const attributes: Record<string, string | number> = a.type === 'strikeout'
      ? { uuid: a.uuid, stroke: strokeColor, strokeWidth: 1, style: 'scale:calc(var(--scale-factor) * 1)' }
      : { uuid: a.uuid, stroke: strokeColor, strokeWidth: '1.35', 'stroke-dasharray': '1.35', style: 'scale:calc(var(--scale-factor) * 1)' };
    this.setAttributes(group, attributes);
    a.rects?.forEach(r => {
      const line = this.defaultLineNode();
      const cords = { x1: r.x, y1: r.y, x2: r.x + r.width, y2: r.y };
      this.setAttributes(line, cords);
      group.appendChild(line);
    });
    return group;
  }

  async renderPath(a: PDFAnnotation): Promise<HTMLElement> {
    const path = this.defaultPathNode();
    const d = [];

    if (a.lines?.length) {
      d.push(`M${a.lines[0][0]} ${a.lines[0][1]}`);
      for (let i = 1; i < a.lines.length; i++) {
        const p1 = a.lines[i];
        d.push(`L${p1[0]} ${p1[1]}`);
      }
    }

    this.setAttributes(path, {
      d: d.join(' '),
      uuid: a.uuid,
      stroke: this.normalizeColor(a.color || '#000'),
      strokeWidth: a.width || 1,
      strokeMiterlimit: 0,
      fill: 'none',
      strokeDasharray: (a as { "stroke-dasharray"?: string })?.["stroke-dasharray"] || 0,
      style: 'scale:calc(var(--scale-factor) * 1)'
    });

    return path;
  }

  async fetchAnnotaitonStructure(annotation: PDFAnnotation[], viewport: PDFPageViewport): Promise<HTMLElement[]> {
    const gNodes = annotation.map(async (ant) => {
      let nodeEl: HTMLElement | null = null;
      if (['area', 'highlight'].includes(ant.type)) {
        nodeEl = this.transform(await this.renderRect(ant), viewport);
      } else if (['strikeout1'].includes(ant.type)) {
        nodeEl = this.transform(await this.renderLine(ant), viewport);
      } else if (['strikeout', 'underline'].includes(ant.type)) {
        nodeEl = this.transform(await this.renderWavyUnderline(ant), viewport);
      } else if (ant.type === 'drawing') {
        nodeEl = this.transform(await this.renderPath(ant), viewport);
      }

      return nodeEl;
    });
    return (await Promise.all(gNodes)).filter(Boolean) as HTMLElement[];
  }

  async generateIcons(icons: iconsGroup[], viewport: PDFPageViewport): Promise<HTMLElement[]> {

    const gNodes = icons.map(async (icon) => {
      let nodeEl: HTMLElement | null = null;

      if (icon) {
        nodeEl = this.transform(await this.renderForeignObject(icon, viewport), viewport);
      }

      return nodeEl;
    });

    return (await Promise.all(gNodes)).filter(Boolean) as HTMLElement[];
  }

  async renderRect(a: PDFAnnotation): Promise<HTMLElement> {
    const group = this.defaultGNode();
    this.setAttributes(group, { uuid: a.uuid, fill: this.normalizeColor(a.color || '#ff0'), style: 'scale: calc(var(--scale-factor) * 1)' });
    a.rects?.forEach((r) => group.appendChild(this.createRect(r)));
    return group;
  }


  async renderForeignObject(icon: iconsGroup, viewport: PDFPageViewport): Promise<HTMLElement> {
    const group = this.defaultForeignObjectNode();
    const groupData: any[] = this.groupByLinkType(icon.uuids);
    const height = ((icon.maxY - icon.minY) > (groupData.length * this.foreignObjSize) ? (icon.maxY - icon.minY) : (groupData.length * this.foreignObjSize));
    const positionY = icon.minY + ((icon.maxY - icon.minY) / 2);
    const positionX = (viewport.rawDims.pageWidth + this.iconXmargin);
    this.setAttributes(group, { style: 'scale: calc(var(--scale-factor) * 1)', x: positionX, min: icon.minY, max: icon.maxY, y: positionY - (height / 2), pos: positionY, posmin: (height / 2), width: this.foreignObjSize, height: height }); // style: 'scale: calc(var(--scale-factor) * 1)', // + (((icon.maxY - icon.minY) / 2))


    group.innerHTML = await this.GenBubleIcon(groupData, icon.maxY - icon.minY);

    return group;
  }


  async GenBubleIcon(groupData: any[], height: number): Promise<string> {
    let strObj = `<div class="rightfloaticons" style="height: 100%;" >
          <hr style="height: ${height}px;" vertical >
          <hr id="verticalHR" horizontal>
          <div class="twobubblewrapper">
      `
    for (let x of groupData) {
      strObj += this.getIcon(x.linktype, x.ids, x.uuids, x.ids.length)
    }
    strObj += `</div></div>
   </div>`
    return String(strObj);
  }

  getIcon = (type: string, dbIds: number[], uuids: string[], number: number) => {
    let html = `<div data-icon ` + uuids.map(a => `icon-${a}`).join(' ');
    html = html + ` class="icons" db-ids="${dbIds ? dbIds.join(',') : ''}" icon-type="${type}"
                        style="box-shadow: rgba(148, 148, 148, 0.25) 0px 3px 10px;">
                      <img src="${(type == 'F' || type == 'QF') ? this.factSvg : (type == 'D' ? this.docSvg : (type == 'P' ? this.hiltSvg : this.webSvg))}"
                            class="md hydrated">
                      <b class="num-counts">
                            <a class="onlynumcounts" style="display: inline;">${number} </a>
                      </b>
        </div>
    `
    return html;
  }
  ////////////////////////////////////////////////////////////////// GROUP BY RECTS

  rangesIntersect(y1: number, h1: number, y2: number, h2: number) {
    return (y1 < y2 + h2) && (y2 < y1 + h1);
  }
  getMinY(annotation: PDFAnnotation): number {
    const rectYValues = annotation.rects ? annotation.rects.map(rect => rect.y) : [];
    const lineYValues = annotation.lines ? annotation.lines.map(line => parseFloat(line[1])) : [];
    return Math.min(...rectYValues, ...lineYValues);
  }

  groupByYIntersections(data: PDFAnnotation[]) {
    // Filter out temporary annotations
    data = data.filter(a => !a.isTemp);


    // Sort the data by the minimum y-value
    data.sort((a, b) => this.getMinY(a) - this.getMinY(b));

    const groups: { uuids: { uuid: string, id: number, linktype: string }[], minY: number, maxY: number }[] = [];

    data.forEach(item => {
      const elements = item.rects || item.lines?.map(line => ({ y: parseFloat(line[1]), height: Number(item.width) || 4 }));
      if (!elements) return;

      let groupFound = false;
      let minY = Math.min(...elements.map(el => el.y));
      let maxY = Math.max(...elements.map(el => el.y + el.height));

      for (const group of groups) {
        for (const member of group.uuids) {
          const memberItem = data.find((d: any) => d.uuid === member.uuid);
          if (!memberItem) continue;

          const memberElements = memberItem.rects || memberItem.lines?.map(line => ({ y: parseFloat(line[1]), height: Number(memberItem.width) || 4 }));
          if (memberElements?.some((memberElement: any) => elements.some(element => this.rangesIntersect(element.y, element.height, memberElement.y, memberElement.height)))) {
            group.uuids.push({ uuid: item.uuid, id: item.id, linktype: item.linktype });
            group.minY = Math.min(group.minY, minY);
            group.maxY = Math.max(group.maxY, maxY);
            groupFound = true;
            break;
          }
        }
        if (groupFound) break;
      }

      if (!groupFound) {
        groups.push({ uuids: [{ uuid: item.uuid, id: item.id, linktype: item.linktype }], minY, maxY });
      }
    });

    return groups.map(group => ({
      uuids: group.uuids,
      minY: group.minY,
      maxY: group.maxY
    }));
  }


  groupByLinkType(data: uuidGroup[]): uuidGroup[] {
    return data.reduce((acc: any, item: any) => {
      const { uuid, id, linktype } = item;
      let group = acc.find((g: uuidGroup) => g.linktype === linktype);

      if (!group) {
        group = { uuids: [], ids: [], linktype };
        acc.push(group);
      }

      group.uuids.push(uuid);
      group.ids.push(id);

      return acc;
    }, []);
  }


}
