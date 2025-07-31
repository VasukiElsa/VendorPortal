import { SafeUrlPipe } from './safe-url.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafeUrlPipe', () => {
  let mockSanitizer: DomSanitizer;

  beforeEach(() => {
    // Fake DomSanitizer with bypassSecurityTrustResourceUrl mocked
    mockSanitizer = {
      bypassSecurityTrustResourceUrl: (url: string) => url
    } as unknown as DomSanitizer;
  });

  it('should create an instance', () => {
    const pipe = new SafeUrlPipe(mockSanitizer);
    expect(pipe).toBeTruthy();
  });

  it('should sanitize the URL', () => {
    const pipe = new SafeUrlPipe(mockSanitizer);
    const url = 'http://example.com/test.pdf';
    const result = pipe.transform(url);
    expect(result).toBe(url);
  });
});
