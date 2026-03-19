import { InteractiveGrasslandExperience } from '@/application/InteractiveGrasslandExperience';
import '@/styles/application.css';

/**
 * The browser entry point stays intentionally small. Its job is only to locate
 * the host element, start the application, and fail loudly if the page is
 * missing the expected mount point.
 */
async function bootstrapApplication(): Promise<void> {
  const applicationRootElement = document.querySelector<HTMLElement>('#application-root');

  if (applicationRootElement === null) {
    throw new Error('The application root element with id "application-root" was not found.');
  }

  const interactiveGrasslandExperience = new InteractiveGrasslandExperience(applicationRootElement);

  await interactiveGrasslandExperience.initialize();
}

void bootstrapApplication();
