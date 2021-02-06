import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeUrl' })
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: any) {
    const objectURL = 'data:image/jpeg;base64,' + url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
  }
}
