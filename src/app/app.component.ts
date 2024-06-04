import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HighlightEditorAnnotation, InkEditorAnnotation, NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { IPDFViewerApplication } from 'ngx-extended-pdf-viewer';

export interface Annotation {
  page: number;
  rect: { x: number; y: number; width: number; height: number };
  color?: string;
  borderColor?: string;
  subtype?: 'square' | 'circle' | 'highlight' | 'underline' | 'strikeout';
  opacity?: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxExtendedPdfViewerModule],
  // schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pdfmanagement';
  pdfSrc: string = './assets/demo.pdf';
  pageViewMode: any = 'multiple';
  pageRotaion: any = 0;

  @ViewChild(NgxExtendedPdfViewerComponent, { static: false })
  private pdfViewer!: NgxExtendedPdfViewerComponent;
  currentPage: number = 1;
  constructor(private pdfService: NgxExtendedPdfViewerService, private cdr: ChangeDetectorRef) {

  }

  ngAfterViewInit() {
    this.pdfService;
  }


  search(event: any) {
    this.pdfService.find(event.target.value);
  }
  nextSearch() {
    this.pdfService.findNext();
  }
  previousSearch() {
    this.pdfService.findPrevious()
  }

  getSerializeAnnot() {
    let annot = this.pdfService.getSerializedAnnotations()
    console.log(annot);
  }

  onPageRendered(e: any) {
    console.log('page rendered', e);
  }
  onTextLayerRendered(e: any) {
    console.log('textlayer rendered', e);
  }

  onPdfLoaded(e: any) {
    console.log('pdf loaded', e);
  }

  onPdfLoadingStarts(e: any) {
    console.log('pdf loading starts', e);
  }

  onAnnotationEditorEvent(e: any) {
    console.log('annotation editor event', e);
  }

  onAnnotationCreated(e: any) {
    console.log('annotation created', e);
  }

  onAnnotationLayerRendered(e: any) {
    console.log('annotation layer rendered', e);
  }

  onAnnotationEditorLayerRendered(e: any) {
    console.log('annotation editor layer rendered', e);
  }

  onXfaLayerRendered(e: any) {
    console.log('xfa layer rendered', e);
  }

  onOutlineLoaded(e: any) {
    console.log('outline loaded', e);
  }


  onLayersLoaded(e: any) {
    console.log('layers loaded', e);
  }

  onProgress(e: any) {
    // console.warn('progress', e.percent, ' ', e.loaded, '/', e.total);
  }


  onSrcChange(e: any) {
    console.log('src change', e);
  }

  onSpreadChange(e: any) {
    console.log('spread change', e);
  }


  onPageChanged(newPage: any) {
    console.warn('page changed', newPage);
    // if (newPage < 5) {
    //   this.currentPage = 5;  // Reset to page 5 if below range
    // } else if (newPage > 10) {
    //   this.currentPage = 10;  // Reset to page 10 if above range
    // } else {
    //   this.currentPage = newPage;  // Allow if within range
    // }

    // this.cdr.detectChanges();
  }


  onFindbarVisibleChange(e: any) {
    console.log('findbar visible change', e);
  }

  onPagesLoaded(e: any) {
    console.log('pages loaded', e);
  }

  onAnnotationEditorModeChanged(e: any) {
    console.log('annotation editor mode changed', e);
  }

  onUpdateFindMatchesCount(e: any) {
    console.log('update find matches count', e);
  }

  onUpdateFindState(e: any) {
    console.log('update find state', e);
  }

  onZoomChanged(e: any) {
    console.log('zoom changed', e);
  }



  setPDFRange() {
    this.pdfService.filteredPageCount(50, { from: 1, to: 50 });
  }

  setMode() {
    this.pdfService.switchAnnotationEdtorMode(9)
    // this.pdfService.editorFontColor = 'red';
    // this.pdfService.editorHighlightColor = 'red';
    this.pdfService.editorHighlightDefaultColor = 'green';
  }


  public addDrawing(): void {
    debugger;
    const drawing: any = {
      "annotationType": 9,
      "color": [
        128,
        235,
        255
      ],
      "opacity": 1,
      "thickness": 12,
      "quadPoints": [
        122.14229337630734,
        726.5100677120456,
        505.485215956165,
        726.5100677120456,
        122.14229337630734,
        739.7132038488952,
        505.485215956165,
        739.7132038488952,
        89.90415511592741,
        712.6974117961511,
        211.15495128016317,
        712.6974117961511,
        89.90415511592741,
        725.9005479330007,
        211.15495128016317,
        725.9005479330007
      ],
      "outlines": [
        [
          121.499,
          726.8144,
          121.499,
          740.6232,
          506.1069999999999,
          740.6232,
          506.1069999999999,
          725.6356000000001,
          211.76049999999998,
          725.6356000000001,
          211.76049999999998,
          711.8268,
          89.25,
          711.8268,
          89.25,
          726.8144
        ]
      ],
      "pageIndex": 0,
      "rect": [
        89.25,
        711.8268,
        506.1069999999999,
        740.6232
      ],
      "rotation": 0,
      "structTreeParentId": null
    }


    // const x = 400 * Math.random();
    // const y = 350 + 500 * Math.random();
    // const drawing: HighlightEditorAnnotation = { //InkEditorAnnotation
    //   annotationType: 9,
    //   color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
    //   // thickness: Math.random() * 10,
    //   // opacity: 1,
    //   // paths: [
    //   //   {
    //   //     bezier: [x + 0.5, y, x + 0.5, y + 44, x + 44, y + 66, x + 88, y + 44],
    //   //     points: [x + 0.5, y, x + 0.5, y + 44],
    //   //   },
    //   // ],
    //   pageIndex: 0,
    //   rect: [
    //     94.158216,
    //     591.059592,
    //     508.227192,
    //     617.499648
    //   ], //[x, y, x + 100, y + 66],
    //   rotation: 0,
    // };
    this.pdfService.addEditorAnnotation(drawing);
  }

}
