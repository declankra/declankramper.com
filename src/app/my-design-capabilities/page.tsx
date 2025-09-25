import { Metadata } from 'next';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';

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
    <main className="mx-auto max-w-2xl px-4 py-12">
      <BreadcrumbNav
        items={[
          { href: '/', label: 'home' },
          { label: 'my design capabilities', current: true },
        ]}
      />

      <header className="mt-10 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">My Design Capabilities</h1>
        <p className="mt-3 text-sm text-foreground/70">Thoughts on design and how I (currently) do it.</p>
      </header>

      <article
        className="prose prose-neutral dark:prose-invert max-w-none
          prose-p:text-sm prose-p:leading-loose prose-p:tracking-normal prose-p:text-foreground/95 prose-p:mb-4
          prose-headings:font-medium prose-headings:tracking-normal prose-headings:mt-8 prose-headings:mb-4
          prose-h2:text-xl prose-h3:text-base
          prose-pre:bg-secondary/50 prose-pre:border-0
          prose-code:text-sm prose-code:text-foreground prose-code:bg-secondary/50 prose-code:px-1 prose-code:rounded
          prose-strong:font-medium
          prose-a:text-foreground prose-a:underline-offset-4
          [&>*:first-child]:mt-0"
      >
        <h2>Design is how it works</h2>
        <p>
          I think of design more-so as <em>how it works</em>, rather than the surface aesthetics (visual/feel/auditory)
          that would normally first come to mind. The aesthetics are certainly a factor, but not the only, and certainly
          not the most important (in my opinion).
        </p>
        <p>
          My sense of design is tactical, practical, and focused on the purpose. And the purpose is achieving whatever
          end goal the user has; therefore, it should start with the user. Then, we can get creative in all the avenues
          to design for that goal in a way that it works. Sometimes that means getting creative in how how we engineer
          parts of the solution because of technical constraints.
        </p>
        <p>
          Like how I built a never-before-done (I checked!) dual-API approach to combine static GTFS stations data with
          dynamic stop API Data to allows Chicago transit riders to select for <em>direction</em> specific train routes
          because that's <em>what makes sense</em>.
        </p>
        <figure>
          <img
            src="/writes/design-capabilities/chitrack-direction.png"
            alt="Chitrack map screen highlighting direction-specific train routes"
            data-media-size="md"
          />
        </figure>
        <p>
          Or how I used Google Apps Script and wrote a function that allowed us to track feedback on a product in an
          interface that we didn't control by easily clicking one link.
        </p>
        <div className="media-row">
          <img src="/writes/design-capabilities/ec-chatbot-link.png" alt="Chatbot flow linking to support" data-media-size="md" />
          <img src="/writes/design-capabilities/ec-chatbot-success.png" alt="Chatbot success confirmation" data-media-size="md" />
          <img src="/writes/design-capabilities/ec-chatbot-log.png" alt="Chatbot log of conversations" data-media-size="md" />

        </div>

        <h2>
          So here's some more examples of things I built that are designed (i.e. work) for the purpose they serve
        </h2>
        <p>
          For the Garpple running app, the magic moment is when runners see their health data on their phone in a way they've never seen
          before — so we do that in their first two clicks.
        </p>
        <div className="media-row">
          <img src="/writes/design-capabilities/garpple-onboarding-1.PNG" alt="Garpple onboarding step one" data-media-size="md" />
          <img src="/writes/design-capabilities/garpple-onboarding-2.PNG" alt="Garpple onboarding step two" data-media-size="md" />
          <img src="/writes/design-capabilities/garpple-onboarding-3.PNG" alt="Garpple onboarding step three" data-media-size="md" />
        </div>
        <p>
          When I couldn't deliver hand written notes to colleagues as a way to thank them for their impact, the next
          best thing to make it "real" was a 3D experience where they could digitally touch and open the letter
          themselves.
        </p>
        <figure>
          <img src="/writes/design-capabilities/interactive-letter-touch.gif" alt="Interactive letter responding to touch input" data-media-size="lg" />
        </figure>
        <p>
          An app that sparks conversations about yourself on a social platform should be easy to share.
        </p>
        <figure>
          <img src="/writes/design-capabilities/strava-share.png" alt="Concept for sharing Strava workouts" data-media-size="md" />
        </figure>
        <p>
          Answering an ambiguous question ("Which Divvy bike station in Chicago needs another rack?") should have an
          experiment designed such that there can be a recommendation.
        </p>
        <div className="media-row">
          <img src="/writes/design-capabilities/divvy-data.png" alt="Divvy dashboard showing ride volume data" data-media-size="md" />
          <img src="/writes/design-capabilities/divvy-design.png" alt="Divvy wireframe highlighting key states" data-media-size="md" />
          <img src="/writes/design-capabilities/divvy-recommendation.png" alt="Divvy station recommendation module" data-media-size="md" />
        </div>
        <p>
          A portfolio given to a recruiter should clearly showcase your work ("show, don't tell") in a format that's easy to scan because they have limited time
        </p>
        <figure>
          <img
            src="/writes/design-capabilities/show-dont-tell.gif"
            alt="Show don't tell motion experiment"
            data-media-size="md"
          />
        </figure>

        <h2>And in general, I believe my designs should follow a few ideals</h2>
        <p>They should be delightful: fun and uniquely human (in a way only the creator can do!)</p>
        <div className="media-row">
          <img src="/writes/design-capabilities/grade-calculator-white-monster.png" alt="Grade calculator interface" data-media-size="md" />
          <img src="/writes/design-capabilities/game.gif" alt="Animated prototype of a playful mini game" data-media-size="lg" />
          <img src="/writes/design-capabilities/pm-advantage-creative.gif" alt="Narrated motion for PM Advantage creative concept" data-media-size="lg" />
        </div>
        <p>They should allow for easy feedback (necessity to improve!)</p>
        <div className="media-row">
          <img src="/writes/design-capabilities/RTC-feedback.png" alt="RTC feedback summary" data-media-size="md" />
          <img src="/writes/design-capabilities/Chitrack-feedback.png" alt="Chitrack post-run feedback survey" data-media-size="md" />
          <img src="/writes/design-capabilities/Chitrack-feedback2.png" alt="Chitrack qualitative feedback digest" data-media-size="md" />
          <img src="/writes/design-capabilities/Garpple-feedback.png" alt="Garpple feedback prompt" data-media-size="md" />
        </div>
        <p>They should be intuitive (even if you've never used it before!)</p>
        <video src="/writes/design-capabilities/Magic-record-player-intuitive.mov" controls playsInline muted data-media-size="lg" />
        <p>and user-centric</p>
        <div className="media-row">
          <img src="/writes/design-capabilities/rtc-flow.png" alt="RTC escalation flow diagram" data-media-size="md" />
          <img src="/writes/design-capabilities/meet-or-not-flow.png" alt="Meet-or-Not flow overview" data-media-size="md" />
        </div>
        <p>with micro-interactions that make the experience stand out</p>
        <figure>
          <img src="/writes/design-capabilities/farmmatch-search-gif.gif" alt="Farmmatch animated search for crop buyers" data-media-size="lg" />
        </figure>
        <p>we shouldn't shy away from inspiration as building blocks!</p>
        <div className="media-row">
          <img src="/writes/design-capabilities/psPRD-inspiration.png" alt="Product spec inspiration board" data-media-size="md" />
          <img src="/writes/design-capabilities/psPRD-implementation.png" alt="Product spec implementation roadmap" data-media-size="md" />
        </div>
        <p>and also update the interaction decisions to account for capabilities of new technologies</p>
        <div className="media-row">
          <img src="/writes/design-capabilities/meet-or-not-preload.png" alt="Meet-or-Not preload state" data-media-size="md" />
          <img src="/writes/design-capabilities/meet-or-not-result.png" alt="Meet-or-Not result screen" data-media-size="md" />
        </div>
      </article>
    </main>
  );
}
