import { Metadata } from 'next';
import Image from 'next/image';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import { cn } from '@/lib/utils';

type MediaSize = 'xs' | 'sm' | 'md' | 'square';
type MediaType = 'image' | 'gif' | 'video';

type MediaItem = {
  src: string;
  alt: string;
  caption?: string;
  size?: MediaSize;
  type?: MediaType;
};

type Subsection = {
  heading: string;
  description?: string;
  media: MediaItem[];
};

type Section = {
  title: string;
  subsections: Subsection[];
};

const defaultCaption = 'Add caption here.';

const sizeClasses: Record<MediaSize, string> = {
  xs: 'w-48 h-32 sm:w-60 sm:h-40',
  sm: 'w-64 h-40 sm:w-80 sm:h-52',
  md: 'w-80 h-52 sm:w-[28rem] sm:h-[18rem]',
  square: 'w-48 h-48 sm:w-60 sm:h-60',
};

const sizeAttributes: Record<MediaSize, string> = {
  xs: '(max-width: 640px) 12rem, 16rem',
  sm: '(max-width: 640px) 16rem, 20rem',
  md: '(max-width: 640px) 20rem, 28rem',
  square: '(max-width: 640px) 12rem, 16rem',
};

const sections: Section[] = [
  {
    title: 'Creative in technical constraints',
    subsections: [
      {
        heading: "Chitrack first of it's kind",
        media: [
          {
            src: '/writes/design-capabilities/Chitrack-direction.png',
            alt: "Chitrack map screen highlighting the runner's next turn",
          },
        ],
      },
      {
        heading: 'Feedback in GPT chatbot',
        media: [
          {
            src: '/writes/design-capabilities/ec-chatbot-link.png',
            alt: 'Chatbot flow linking to concierge support',
          },
          {
            src: '/writes/design-capabilities/ec-chatbot-log.png',
            alt: "Chatbot log of customer conversations",
          },
          {
            src: '/writes/design-capabilities/ec-chatbot-success.png',
            alt: 'Chatbot success confirmation screen',
          },
        ],
      },
    ],
  },
  {
    title: 'Purpose',
    subsections: [
      {
        heading: "Magic Moment as soon as possible to show them something they've never seen before",
        media: [
          {
            src: '/writes/design-capabilities/garpple-onboarding-1.PNG',
            alt: 'Garpple onboarding step one',
          },
          {
            src: '/writes/design-capabilities/garpple-onboarding-2.PNG',
            alt: 'Garpple onboarding step two',
          },
          {
            src: '/writes/design-capabilities/garpple-onboarding-3.PNG',
            alt: 'Garpple onboarding step three',
          },
        ],
      },
      {
        heading: 'Connection: so make it real',
        media: [
          {
            src: '/writes/design-capabilities/interactive-letter-touch.gif',
            alt: 'Interactive letter responding to touch input',
            type: 'gif',
          },
          {
            src: '/writes/design-capabilities/show-dont-tell.gif',
            alt: "Show don't tell motion experiment",
            type: 'gif',
          },
        ],
      },
      {
        heading: 'Enable people to share and experience with others',
        media: [
          {
            src: '/writes/design-capabilities/strava-share.png',
            alt: "Concept for sharing Strava workouts",
          },
        ],
      },
      {
        heading: 'Design experiments to be testable so you can use data to diagnose problems',
        media: [
          {
            src: '/writes/design-capabilities/divvy-data.png',
            alt: 'Divvy dashboard showing ride volume data',
          },
          {
            src: '/writes/design-capabilities/divvy-design.png',
            alt: 'Divvy wireframe highlighting key interaction states',
          },
          {
            src: '/writes/design-capabilities/divvy-recommendation.png',
            alt: 'Divvy recommendations module',
          },
        ],
      },
    ],
  },
  {
    title: 'Other principles',
    subsections: [
      {
        heading: 'Delightful: Fun and uniquely human',
        media: [
          {
            src: '/writes/design-capabilities/Chitrack-one.png',
            alt: 'Chitrack onboarding screen introducing the guided run',
          },
          {
            src: '/writes/design-capabilities/Chitrack-run.png',
            alt: 'Chitrack in-run view with pace and coaching prompts',
          },
          {
            src: '/writes/design-capabilities/grade-calculator-white-monster.png',
            alt: 'Grade calculator interface for the White Monster project',
          },
          {
            src: '/writes/design-capabilities/game.gif',
            alt: 'Animated prototype of a playful mini game',
            type: 'gif',
          },
          {
            src: '/writes/design-capabilities/pm-advantage-creative.gif',
            alt: 'Narrated motion for PM Advantage creative concept',
            type: 'gif',
          },
        ],
      },
      {
        heading: 'Feedback to learn',
        media: [
          {
            src: '/writes/design-capabilities/RTC-feedback.png',
            alt: 'RTC feedback summary',
          },
          {
            src: '/writes/design-capabilities/Chitrack-feedback.png',
            alt: 'Chitrack post-run feedback survey',
          },
          {
            src: '/writes/design-capabilities/Chitrack-feedback2.png',
            alt: 'Chitrack qualitative feedback digest',
          },
          {
            src: '/writes/design-capabilities/Garpple-feedback.png',
            alt: 'Garpple feedback prompt',
          },
        ],
      },
      {
        heading: 'Intuitive magic record player controls',
        media: [
          {
            src: '/writes/design-capabilities/Magic-record-player-intuitive.mov',
            alt: 'Magic record player interaction demo',
            type: 'video',
            size: 'md',
          },
        ],
      },
      {
        heading: 'User-centric design',
        media: [
          {
            src: '/writes/design-capabilities/rtc-flow.png',
            alt: 'RTC escalation flow diagram',
          },
          {
            src: '/writes/design-capabilities/meet-or-not-flow.png',
            alt: 'Meet-or-Not flow overview',
          },
        ],
      },
      {
        heading: 'Simple language',
        media: [
          {
            src: '/writes/design-capabilities/garpple-simple-language.png',
            alt: 'Garpple screen simplifying language for users',
          },
        ],
      },
      {
        heading: 'Micro-interactions',
        media: [
          {
            src: '/writes/design-capabilities/farmmatch-search-gif.gif',
            alt: 'Farmmatch animated search for crop buyers',
            type: 'gif',
          },
        ],
      },
      {
        heading: 'Take inspiration',
        media: [
          {
            src: '/writes/design-capabilities/psPRD-inspiration.png',
            alt: 'Product spec inspiration board',
          },
          {
            src: '/writes/design-capabilities/psPRD-implementation.png',
            alt: 'Product spec implementation roadmap',
          },
        ],
      },
      {
        heading: 'Account for new technologies',
        media: [
          {
            src: '/writes/design-capabilities/meet-or-not-preload.png',
            alt: 'Meet-or-Not preload state',
          },
          {
            src: '/writes/design-capabilities/meet-or-not-result.png',
            alt: 'Meet-or-Not result screen',
          },
        ],
      },
    ],
  },
];

function MediaAsset({ item }: { item: MediaItem }) {
  const size = item.size ?? 'xs';
  const resolvedType: MediaType = item.type ?? (item.src.toLowerCase().endsWith('.gif') ? 'gif' : 'image');
  const figurePadding = size === 'xs' ? 'p-2' : 'p-3';

  if (resolvedType === 'video') {
    return (
      <figure className={cn('flex-none snap-start', figurePadding)}>
        <video
          src={item.src}
          className={cn('rounded-lg bg-black object-contain', sizeClasses[size])}
          controls
          playsInline
          muted
        />
      </figure>
    );
  }

  return (
    <figure className={cn('flex-none snap-start', figurePadding)}>
      <div className={cn('relative overflow-hidden rounded-lg bg-muted/40', sizeClasses[size])}>
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes={sizeAttributes[size]}
          className="object-contain"
          unoptimized={resolvedType === 'gif'}
        />
      </div>
    </figure>
  );
}

function MediaRow({ media }: { media: MediaItem[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 pr-2 scroll-smooth snap-x snap-mandatory">
      {media.map((item) => (
        <MediaAsset key={item.src} item={item} />
      ))}
    </div>
  );
}

export const metadata: Metadata = {
  title: 'My Design Capabilities - Declan Kramper',
  description: 'Thoughts on design and how I (currently) do it.',
  openGraph: {
    title: 'My Design Capabilities - Declan Kramper',
    description: 'Thoughts on design and how I (currently) do it.',
    type: 'website',
  },
};

export default function MyDesignCapabilitiesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <BreadcrumbNav
        items={[
          { href: '/', label: 'home' },
          { label: 'my design capabilities', current: true },
        ]}
      />

      <header className="mt-10 mb-12 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">My Design Capabilities</h1>
        <p className="mt-3 text-sm text-foreground/70">Thoughts on design and how I (currently) do it.</p>
      </header>

      <section className="mb-12 max-w-3xl space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Design is how it works</h2>
        <p className="text-sm text-foreground/80">
          I think of design more-so as{' '}
          <span className="italic">how it works</span>, rather than the surface aesthetics (visual/feel/auditory) that
          would normally first come to mind. The aesthetics are certainly a factor, but not the only, and certainly not
          the most important (in my opinion).
        </p>
        <p className="text-sm text-foreground/80">
          My sense of design is tactical, practical, and focused on the purpose. And the purpose is achieving whatever
          end goal the user has; therefore, it should start with the user. Then, we can get creative in all the avenues
          to design for that goal in a way that it works. Sometimes that means getting creative in how how we engineer
          parts of the solution because of technical constraints. /my-design-capabilties
        </p>
      </section>

      <div className="space-y-16">
        {sections.map((section) => (
          <section key={section.title} className="space-y-10">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{section.title}</h2>
            <div className="space-y-10">
              {section.subsections.map((subsection) => (
                <div key={subsection.heading} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground">{subsection.heading}</h3>
                    {subsection.description && (
                      <p className="mt-2 text-sm text-foreground/70">{subsection.description}</p>
                    )}
                  </div>
                  <MediaRow media={subsection.media} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
