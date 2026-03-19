import { DiagnosticLogger } from '@/telemetry/DiagnosticLogger';

describe('DiagnosticLogger', () => {
  it('buffers structured log entries in insertion order', () => {
    const diagnosticLogger = new DiagnosticLogger(5);

    diagnosticLogger.info('test', 'First message.');
    diagnosticLogger.warning('test', 'Second message.');

    const bufferedEntries = diagnosticLogger.getBufferedEntries();

    expect(bufferedEntries).toHaveLength(2);
    expect(bufferedEntries[0]?.message).toBe('First message.');
    expect(bufferedEntries[1]?.severity).toBe('warning');
  });

  it('drops the oldest entries when the maximum buffer is exceeded', () => {
    const diagnosticLogger = new DiagnosticLogger(2);

    diagnosticLogger.info('test', 'First message.');
    diagnosticLogger.info('test', 'Second message.');
    diagnosticLogger.info('test', 'Third message.');

    const bufferedEntries = diagnosticLogger.getBufferedEntries();

    expect(bufferedEntries).toHaveLength(2);
    expect(bufferedEntries[0]?.message).toBe('Second message.');
    expect(bufferedEntries[1]?.message).toBe('Third message.');
  });

  it('emits events and supports the debug and error levels', () => {
    const diagnosticLogger = new DiagnosticLogger(10);
    const recordedMessages: string[] = [];

    diagnosticLogger.addEventListener('diagnostic-log-entry-recorded', (event) => {
      const diagnosticEvent = event as CustomEvent<{ message: string }>;

      recordedMessages.push(diagnosticEvent.detail.message);
    });

    diagnosticLogger.debug('test', 'Debug message.');
    diagnosticLogger.error('test', 'Error message.', {
      context: 'test-case',
    });

    expect(recordedMessages).toEqual(['Debug message.', 'Error message.']);
    expect(diagnosticLogger.getBufferedEntries()[1]?.details).toEqual({
      context: 'test-case',
    });
  });

  it('downloads the buffered entries through the browser URL APIs', () => {
    const diagnosticLogger = new DiagnosticLogger(10);
    const createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url');
    const revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    diagnosticLogger.info('test', 'Download message.');

    diagnosticLogger.downloadBufferedEntries();

    expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:test-url');
  });
});
