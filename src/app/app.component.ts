import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnnotationEditorEditorModeChangedEvent, FreeTextEditorAnnotation, HighlightEditorAnnotation, InkEditorAnnotation, NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService, PdfHighlightEditorComponent, ResponsiveVisibility } from 'ngx-extended-pdf-viewer';
import { IPDFViewerApplication } from 'ngx-extended-pdf-viewer';
import { PdfComponent } from './pdfviewer/pdf/pdf.component';
import { ResizableRectangleComponent } from './resizable-rectangle/resizable-rectangle.component';

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
  imports: [RouterOutlet, NgxExtendedPdfViewerModule,PdfComponent,ResizableRectangleComponent],
  // schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('pdfViewer') pdfViewer!: PdfHighlightEditorComponent;
  // @ViewChild(NgxExtendedPdfViewerComponent) pdfViewer: NgxExtendedPdfViewerComponent;

  title = 'pdfmanagement';
  pdfSrc: string = './assets/demo.pdf';
  pageViewMode: any = 'multiple';
  pageRotaion: any = 0;

  // @ViewChild(NgxExtendedPdfViewerComponent, { static: false })
  // private pdfViewer!: NgxExtendedPdfViewerComponent;
  currentPage: number = 1;
  highlightOBJ: HighlightEditorAnnotation = {
    annotationType: 9,
    color: [255, 255, 152],
    rect: [134.35915854669386, 726.5100677120456, 228.06898024774367, 739.7132038488952],
    pageIndex: 0,
    rotation: 0
  }

  public show: ResponsiveVisibility = true;

  public isSelected = false;

  constructor(private pdfService: NgxExtendedPdfViewerService, private cdr: ChangeDetectorRef) {
    document.addEventListener('mouseup', () => {
      const selection: any = window.getSelection();
      if (selection.rangeCount > 0) {
        return;
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const coordinates = {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        };
        console.log('Screen Coordinates:', coordinates);
        // Assuming the PDF is rendered within an element with id 'pdfViewer'
        const pdfViewer:any = document.getElementById('viewer');
        const pdfViewerRect = pdfViewer.getBoundingClientRect();
        const pdfCoordinates = {
          x: coordinates.x - pdfViewerRect.left,
          y: coordinates.y - pdfViewerRect.top,
          width: coordinates.width,
          height: coordinates.height
        };
        console.log('PDF Coordinates:', pdfCoordinates);
        // Create the annotation object
        const annotation: any = this.createAnnotationObject(pdfCoordinates);
        console.log('Annotation Object:', annotation);
        // Add annotation to the PDF viewer (adjust this according to your PDF viewer API)
        // pdfViewer.addAnnotation(annotation); // Example method call

        setTimeout(() => {
          this.pdfService.addEditorAnnotation(annotation);
        }, 300);
      }
    });
  }

  convertToPdfCoordinates(screenCoordinates: any, pdfViewerRect: any) {
    return {
      x: screenCoordinates.x - pdfViewerRect.left,
      y: screenCoordinates.y - pdfViewerRect.top,
      width: screenCoordinates.width,
      height: screenCoordinates.height
    };
  }

  createAnnotationObject(pdfCoordinates: any) {
    const bezierPoints = [];
    const points = [];
    const x = pdfCoordinates.x;
    const y = pdfCoordinates.y;
    const width = pdfCoordinates.width;
    const height = pdfCoordinates.height;

    // Assuming the text selection spans multiple lines, we can add points for each line
    for (let i = 0; i <= height; i += 10) {
      bezierPoints.push(x, y + i, x + width, y + i);
      points.push(x, y + i, x + width, y + i);
    }

    return {
      annotationType: 15,
      color: [0, 0, 0],
      thickness: 8,
      opacity: 0.48,
      paths: [
        {
          bezier: points,
          points: points
        }
      ],
      pageIndex: 0,
      rect: [x, y, x + width, y + height],
      rotation: 0,
      structTreeParentId: ""
    };
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
    debugger;
    console.log('textlayer rendered', e);

  }

  onPdfLoaded(e: any) {
    debugger;
    console.log('pdf loaded', e);

    const PDFViewerApplication: IPDFViewerApplication = (window as any).PDFViewerApplication;
    PDFViewerApplication.eventBus.on('annotationeditormodechanged', ({ mode }: AnnotationEditorEditorModeChangedEvent) => {
      console.warn(mode);
    });

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
    debugger;
    console.log('annotation layer rendered', e);
  }

  onAnnotationEditorLayerRendered(e: any) {
    debugger;
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
    this.pdfViewer;

    // const selectedText = window.getSelection();
    // if (selectedText !== null) {
    //   const text = selectedText.toString();
    //   if (text) {
    //     this.pdfViewer.addHighlight({ text });
    //   }
    // }

    // return;
    // const drawing:any = {
    //   "annotationType": 9,
    //   "color": [
    //     255,
    //     255,
    //     152
    //   ],
    //   "opacity": 1,
    //   "thickness": 12,
    //   "quadPoints": [
    //     134.35915854669386,
    //     726.5100677120456,
    //     228.06898024774367,
    //     726.5100677120456,
    //     134.35915854669386,
    //     739.7132038488952,
    //     228.06898024774367,
    //     739.7132038488952
    //   ],
    //   "outlines": [
    //     [
    //       133.75599999999997,
    //       725.6356,
    //       133.75599999999997,
    //       740.6232,
    //       228.71799999999996,
    //       740.6232,
    //       228.71799999999996,
    //       725.6356
    //     ]
    //   ],
    //   "pageIndex": 0,
    //   "rect": [
    //     133.75599999999997,
    //     725.6356,
    //     228.71799999999996,
    //     740.6232
    //   ],
    //   "rotation": 0,
    //   "structTreeParentId": null
    // }

    /*
        const x = Math.round(Math.random() * 400);
        const y = Math.round(350 + Math.random() * 500);
        const fontSize = Math.round(Math.random() * 30 + 10);
        const height = fontSize * 1.75;
        const width = fontSize * 5.8;
        const textEditorAnnotation: FreeTextEditorAnnotation = {
          annotationType: 3,
          color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
          fontSize: fontSize,
          value: 'Hello world!',
          pageIndex: 0,
          rect: [
            x,
            y,
            x + width,
            y + height
          ],
          rotation: 0,
        };
        console.log(textEditorAnnotation);
        console.log('Before update');
        this.pdfService.addEditorAnnotation(textEditorAnnotation);
        console.log('After update');
        let anno = this.pdfService.getSerializedAnnotations();
        if (anno) {
          console.log(anno[0]);
        }*/
    /*  const x = 400 * Math.random();
      const y = 350 + 500 * Math.random();
      const drawing: InkEditorAnnotation = {
        annotationType: 15,
        color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
        thickness:  10,
        opacity: 1,
        paths: [
          {
            bezier: [x + 0.5, y, x + 0.5, y + 44, x + 44, y + 66, x + 88, y + 44],
            points: [x + 0.5, y, x + 0.5, y + 44],
          },
        ],
        pageIndex: 0,
        rect: [x, y, x + 100, y + 66],
        rotation: 0,
      };*/
    const drawing = this.highlightOBJ;
   let data =  this.pdfService.addEditorAnnotation(drawing);
   debugger;
    // addSerializedEditor
    /* const x = 400 * Math.random();
     const y = 350 + 500 * Math.random();
     const drawing: InkEditorAnnotation = {
       annotationType: 15,
       color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
       thickness: Math.random() * 10,
       opacity: 1,
       paths: [
         {
           bezier: [x + 0.5, y, x + 0.5, y + 44, x + 44, y + 66, x + 88, y + 44],
           points: [x + 0.5, y, x + 0.5, y + 44],
         },
       ],
       pageIndex: 0,
       rect: [x, y, x + 100, y + 66],
       rotation: 0,
     };
     this.pdfService.addEditorAnnotation(drawing);*/
    this.getSerializeAnnot();
  }



  // public updateAnnotation(index: number, event: Event): void {
  //   const textarea = event.target as HTMLTextAreaElement;
  //   console.log('Before update');
  //   let anno = this.pdfService.getSerializedAnnotations();
  //   if (anno) {
  //     console.log(anno[0]);
  //   }
  //   if (this.rawAnnotations) {
  //     const value = textarea.value.replace(/\n/g, '');
  //     this.rawAnnotations[index] = JSON.parse(value);

  //     this.removeEditors();
  //     for (const annotation of this.rawAnnotations) {
  //       this.pdfViewerService.addEditorAnnotation(annotation);
  //     }
  //   }
  //   console.log('After update');
  //   anno = this.pdfViewerService.getSerializedAnnotations();
  //   if (anno) {
  //     console.log(anno[0]);
  //   }
  // }
  public onClick(): void {
    document.getElementById('editorHighlight')?.click();
  }
}
