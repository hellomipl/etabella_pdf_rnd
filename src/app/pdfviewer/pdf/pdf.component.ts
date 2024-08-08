import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { HighlightEditorAnnotation, IPDFViewerApplication, NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { PdfService } from '../service/pdf.service';
import { PDFAnnotation, PDFPageViewport, iconsGroup, itemPosition } from '../interfaces/pdf.interface';
import { ResizableRectangleComponent } from '../../resizable-rectangle/resizable-rectangle.component';
import { ApiService } from '../../api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'pdf',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxExtendedPdfViewerModule, ResizableRectangleComponent, HttpClientModule],
  providers: [ApiService],
  templateUrl: './pdf.component.html',
  styleUrl: './pdf.component.scss'
})
export class PdfComponent {
  @ViewChild(NgxExtendedPdfViewerComponent) pdfViewer!: NgxExtendedPdfViewerComponent;



  //pdfSrc: string = 'http://localhost:4500/assets/demo.pdf';
  pdfSrc: string = 'https://etabella.legal:3443/doc/case22/file_602878100339.PDF';
  pageViewMode: any = 'multiple';
  pageRotaion: any = 0;
  currentPage: number = 0;

  globannots: PDFAnnotation[] = [];

  pageViewports: Map<number, PDFPageViewport> = new Map<number, PDFPageViewport>();

  // handtools 
  highlightBox:boolean = false;
  highlightBoxPosition:itemPosition = {} as itemPosition;

  constructor(private pdfExtendedService: NgxExtendedPdfViewerService, private pdfService: PdfService, private cdr: ChangeDetectorRef, private api: ApiService) {

    this.initData();
  }

  initData() {
    this.api.get_casual('text_demoannotations', {}, (res: PDFAnnotation[]) => {

      if (res && res.length) {
        this.globannots.push(...res);
        this.cdr.detectChanges();
      }
    })
  }



  annotationByPage(pageNumber: number): PDFAnnotation[] {
    const data: PDFAnnotation[] = this.globannots.filter(a => a.page == pageNumber); // [...this.facts.filter((a: PDFAnnotation) => a.page == pageNumber), ...this.docs.filter((a: PDFAnnotation) => a.page == pageNumber), ...this.webs.filter((a: PDFAnnotation) => a.page == pageNumber), ...this.lines.filter((a: PDFAnnotation) => a.page == pageNumber)];
    return data;
  }

  onTextLayerRendered(e: any) {

  }

  onLayersLoaded(e: any) {
    // debugger;
  }

  onXfaLayerRendered(e: any) {
    // debugger; 
  }

  onAnnotationLayerRendered(e: any) {
    // debugger;
  }

  renderAnnotation() {

  }


  onPageChange(e: any) {
    this.pdfViewer;
    // console.warn(e,  this.pdfViewer["elementRef"].nativeElement.querySelector('[data-page-number="1"]'));
  }

  getPageViewPort(page: number): PDFPageViewport {
    return this.pageViewports.get(page) as PDFPageViewport;
  }


  async onPageRendered(e: any) {
    debugger;
    this.pageViewports.set(e.pageNumber, e.source.viewport);
    const anotData: PDFAnnotation[] = this.annotationByPage(e.pageNumber);
    if (anotData.length) {
      const SVG: HTMLElement = this.pdfService.defaultSVG();
      const gNodes: HTMLElement[] = await this.pdfService.fetchAnnotaitonStructure(anotData, e.source.viewport);
      if (gNodes.length) {
        const matcherd: iconsGroup[] = this.pdfService.groupByYIntersections(anotData);
        if (matcherd.length) {
          const icons: HTMLElement[] = await this.pdfService.generateIcons(matcherd, e.source.viewport);
          gNodes.unshift(...icons);
        }
        SVG.append(...gNodes)
        e.source.div.insertBefore(SVG, e.source.div.firstChild)
      } else {
        console.error('ANNOTATION ARE INVALID HIGHLIGHT', anotData);
      }
    }
  }



  OnMouseUp(e: any) {
    const selection = window.getSelection();
    if (selection?.rangeCount == 1 && selection?.type == 'Range') { //selectdion?.toString().length
      debugger;
      this.highlightBox = true;
      // const page: any = e.target.closest('[data-page-number]')?.getBoundingClientRect() | null;
      // if (page) {

      // }

      // const pageNumber: number = Number(e.target.closest('[data-page-number]')?.getAttribute('data-page-number')) | 0;
      // if (pageNumber) {
      // const viewPort: PDFPageViewport = this.getPageViewPort(pageNumber);
      // console.log(e.clientX, e.clientY, e.screenX, e.screenY,viewPort);
      // }
    }
  }



}