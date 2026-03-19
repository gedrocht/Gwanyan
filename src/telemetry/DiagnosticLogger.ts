/**
 * Diagnostic log levels are intentionally explicit because beginners often
 * learn observability concepts more easily when the level names are easy to
 * recognize in both code and the on-screen overlay.
 */
export type DiagnosticLogSeverity = 'debug' | 'information' | 'warning' | 'error';

/**
 * This is the structured log format stored in memory and exposed to the UI.
 */
export interface DiagnosticLogEntry {
  readonly sequenceNumber: number;
  readonly recordedAtTimeInMilliseconds: number;
  readonly severity: DiagnosticLogSeverity;
  readonly sourceSubsystem: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

/**
 * DiagnosticLogger provides structured logging that is accessible through:
 * - browser developer tools,
 * - an in-page overlay,
 * - a global window hook for ad-hoc inspection,
 * - and a downloadable JSON snapshot.
 */
export class DiagnosticLogger extends EventTarget {
  private readonly maximumBufferedLogEntryCount: number;

  private readonly bufferedEntries: DiagnosticLogEntry[] = [];

  private nextSequenceNumber = 1;

  /**
   * Creates a structured logger with a bounded in-memory ring buffer.
   */
  public constructor(maximumBufferedLogEntryCount: number) {
    super();
    this.maximumBufferedLogEntryCount = maximumBufferedLogEntryCount;
  }

  /**
   * Records a debug message.
   */
  public debug(sourceSubsystem: string, message: string, details?: Record<string, unknown>): void {
    this.recordEntry('debug', sourceSubsystem, message, details);
  }

  /**
   * Records an informational message.
   */
  public info(sourceSubsystem: string, message: string, details?: Record<string, unknown>): void {
    this.recordEntry('information', sourceSubsystem, message, details);
  }

  /**
   * Records a warning message.
   */
  public warning(
    sourceSubsystem: string,
    message: string,
    details?: Record<string, unknown>,
  ): void {
    this.recordEntry('warning', sourceSubsystem, message, details);
  }

  /**
   * Records an error message.
   */
  public error(sourceSubsystem: string, message: string, details?: Record<string, unknown>): void {
    this.recordEntry('error', sourceSubsystem, message, details);
  }

  /**
   * Returns a copy of the current in-memory buffer.
   */
  public getBufferedEntries(): DiagnosticLogEntry[] {
    return [...this.bufferedEntries];
  }

  /**
   * Downloads the current buffer as a JSON file. This is useful when a user
   * wants to attach logs to a bug report without having to manually copy
   * messages from the browser console.
   */
  public downloadBufferedEntries(): void {
    const logSnapshot = JSON.stringify(this.bufferedEntries, null, 2);
    const snapshotBlob = new Blob([logSnapshot], { type: 'application/json' });
    const snapshotUrl = URL.createObjectURL(snapshotBlob);
    const downloadAnchor = document.createElement('a');

    downloadAnchor.href = snapshotUrl;
    downloadAnchor.download = `gwanyan-diagnostics-${String(Date.now())}.json`;
    downloadAnchor.click();

    URL.revokeObjectURL(snapshotUrl);
  }

  private recordEntry(
    severity: DiagnosticLogSeverity,
    sourceSubsystem: string,
    message: string,
    details?: Record<string, unknown>,
  ): void {
    const entry: DiagnosticLogEntry = {
      sequenceNumber: this.nextSequenceNumber,
      recordedAtTimeInMilliseconds: Date.now(),
      severity,
      sourceSubsystem,
      message,
    };

    if (details !== undefined) {
      Object.assign(entry, { details });
    }

    this.nextSequenceNumber += 1;
    this.bufferedEntries.push(entry);

    while (this.bufferedEntries.length > this.maximumBufferedLogEntryCount) {
      this.bufferedEntries.shift();
    }

    const consoleMethod =
      severity === 'error' ? console.error : severity === 'warning' ? console.warn : console.info;

    consoleMethod(
      `[${entry.severity}] ${entry.sourceSubsystem}: ${entry.message}`,
      entry.details ?? {},
    );
    this.dispatchEvent(
      new CustomEvent<DiagnosticLogEntry>('diagnostic-log-entry-recorded', {
        detail: entry,
      }),
    );
  }
}
