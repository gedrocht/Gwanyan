import { DiagnosticLogger } from '@/telemetry/DiagnosticLogger';
import { DiagnosticOverlay } from '@/telemetry/DiagnosticOverlay';

describe('DiagnosticOverlay', () => {
  it('renders buffered log entries and frame timing information', () => {
    const hostElement = document.createElement('div');
    const diagnosticLogger = new DiagnosticLogger(10);

    diagnosticLogger.info('test', 'Overlay test message.');

    const diagnosticOverlay = new DiagnosticOverlay(diagnosticLogger, 10);

    diagnosticOverlay.mount(hostElement);
    diagnosticOverlay.recordFrameDuration(16.6);

    expect(hostElement.textContent).toContain('Diagnostics');
    expect(hostElement.textContent).toContain('Overlay test message.');
    expect(hostElement.textContent).toContain('Average frame time');

    diagnosticOverlay.dispose();
  });

  it('responds to new log events, trims visible entries, and wires the download button', () => {
    const hostElement = document.createElement('div');
    const diagnosticLogger = new DiagnosticLogger(50);
    const downloadSpy = vi
      .spyOn(diagnosticLogger, 'downloadBufferedEntries')
      .mockImplementation(() => undefined);
    const diagnosticOverlay = new DiagnosticOverlay(diagnosticLogger, 2);

    diagnosticOverlay.mount(hostElement);

    for (let entryIndex = 0; entryIndex < 14; entryIndex += 1) {
      diagnosticLogger.info('test', `Live message ${String(entryIndex)}.`);
      diagnosticOverlay.recordFrameDuration(16 + entryIndex);
    }

    const downloadButton = hostElement.querySelector('button');

    if (downloadButton === null) {
      throw new Error('Expected the diagnostics overlay to render a download button.');
    }

    downloadButton.click();

    expect(downloadSpy).toHaveBeenCalledTimes(1);
    expect(hostElement.querySelectorAll('li')).toHaveLength(12);

    diagnosticOverlay.dispose();
    diagnosticLogger.info('test', 'Post-dispose message.');

    expect(hostElement.textContent).not.toContain('Post-dispose message.');
  });
});
