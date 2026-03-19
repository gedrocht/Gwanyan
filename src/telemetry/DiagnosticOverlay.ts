import type { DiagnosticLogEntry, DiagnosticLogger } from '@/telemetry/DiagnosticLogger';

/**
 * The diagnostic overlay provides a beginner-friendly window into what the
 * application is doing in real time. It displays the latest logs, a rolling
 * frame rate estimate, and a button to export logs.
 */
export class DiagnosticOverlay {
  private readonly logger: DiagnosticLogger;

  private readonly maximumFrameSamples: number;

  private readonly rootElement: HTMLDivElement;

  private readonly logListElement: HTMLUListElement;

  private readonly performanceSummaryElement: HTMLParagraphElement;

  private readonly recentFrameDurationsInMilliseconds: number[] = [];

  /**
   * Creates a diagnostics panel that subscribes to a shared logger.
   */
  public constructor(logger: DiagnosticLogger, maximumFrameSamples: number) {
    this.logger = logger;
    this.maximumFrameSamples = maximumFrameSamples;
    this.rootElement = document.createElement('div');
    this.logListElement = document.createElement('ul');
    this.performanceSummaryElement = document.createElement('p');
  }

  /**
   * Inserts the overlay into the provided host element.
   */
  public mount(hostElement: HTMLElement): void {
    this.rootElement.className = 'diagnostic-overlay';

    const headingElement = document.createElement('h2');
    const descriptionElement = document.createElement('p');
    const controlsRowElement = document.createElement('div');
    const exportLogsButtonElement = document.createElement('button');

    headingElement.textContent = 'Diagnostics';
    descriptionElement.textContent =
      'Live logs, frame timing, and export controls. This panel is designed to help beginners see what the simulation is doing.';
    controlsRowElement.className = 'diagnostic-overlay__controls';
    exportLogsButtonElement.type = 'button';
    exportLogsButtonElement.textContent = 'Download Logs';
    exportLogsButtonElement.addEventListener('click', () => {
      this.logger.downloadBufferedEntries();
    });

    this.performanceSummaryElement.className = 'diagnostic-overlay__performance-summary';
    this.performanceSummaryElement.textContent =
      'Frame rate information will appear after the first few frames.';
    this.logListElement.className = 'diagnostic-overlay__log-list';

    controlsRowElement.append(exportLogsButtonElement);
    this.rootElement.append(
      headingElement,
      descriptionElement,
      this.performanceSummaryElement,
      controlsRowElement,
      this.logListElement,
    );
    hostElement.append(this.rootElement);

    for (const bufferedEntry of this.logger.getBufferedEntries()) {
      this.appendLogEntry(bufferedEntry);
    }

    this.logger.addEventListener(
      'diagnostic-log-entry-recorded',
      this.handleDiagnosticLogEntryRecorded,
    );
  }

  /**
   * Records a new frame duration and updates the displayed frame rate summary.
   */
  public recordFrameDuration(frameDurationInMilliseconds: number): void {
    this.recentFrameDurationsInMilliseconds.push(frameDurationInMilliseconds);

    while (this.recentFrameDurationsInMilliseconds.length > this.maximumFrameSamples) {
      this.recentFrameDurationsInMilliseconds.shift();
    }

    const averageFrameDurationInMilliseconds =
      this.recentFrameDurationsInMilliseconds.reduce(
        (totalDuration, currentDuration) => totalDuration + currentDuration,
        0,
      ) / Math.max(this.recentFrameDurationsInMilliseconds.length, 1);
    const approximateFramesPerSecond = 1000 / Math.max(averageFrameDurationInMilliseconds, 1);

    this.performanceSummaryElement.textContent =
      `Average frame time: ${averageFrameDurationInMilliseconds.toFixed(2)} ms. ` +
      `Approximate frame rate: ${approximateFramesPerSecond.toFixed(1)} frames per second.`;
  }

  /**
   * Removes event listeners when the application shuts down.
   */
  public dispose(): void {
    this.logger.removeEventListener(
      'diagnostic-log-entry-recorded',
      this.handleDiagnosticLogEntryRecorded,
    );
  }

  private readonly handleDiagnosticLogEntryRecorded = (event: Event): void => {
    const diagnosticLogEntry = (event as CustomEvent<DiagnosticLogEntry>).detail;

    this.appendLogEntry(diagnosticLogEntry);
  };

  private appendLogEntry(diagnosticLogEntry: DiagnosticLogEntry): void {
    const listItemElement = document.createElement('li');
    const recordedDate = new Date(diagnosticLogEntry.recordedAtTimeInMilliseconds);

    listItemElement.className = `diagnostic-overlay__log-entry diagnostic-overlay__log-entry--${diagnosticLogEntry.severity}`;
    listItemElement.textContent =
      `${recordedDate.toLocaleTimeString()} | ${diagnosticLogEntry.severity.toUpperCase()} | ` +
      `${diagnosticLogEntry.sourceSubsystem} | ${diagnosticLogEntry.message}`;

    this.logListElement.prepend(listItemElement);

    while (this.logListElement.children.length > 12) {
      this.logListElement.lastElementChild?.remove();
    }
  }
}
