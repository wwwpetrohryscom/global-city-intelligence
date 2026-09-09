import type { Metadata } from "next";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  PRIVACY_BLOCKERS,
  PRIVACY_FACTS,
  PRIVACY_LOCAL_STORAGE,
  PRIVACY_OPERATOR,
  PRIVACY_PREPARED_ON,
  PRIVACY_THIRD_PARTIES,
} from "@/lib/legal/privacy";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { staticRoutes } from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

/**
 * THE CANONICAL PRIVACY POLICY.
 *
 * One page, for the whole product family: the main site, GCI Places and GCI
 * Media all link here. A second policy per product would be a second thing to
 * keep true, and the two would drift within a release.
 *
 * IT DESCRIBES WHAT THE PRODUCT DOES, checked against what it actually does.
 * Every claim below comes from `lib/legal/privacy.ts`, whose values were
 * recorded by loading each surface in a browser and listing what it contacted,
 * stored and set — not assembled from a dependency list, which describes the
 * build rather than the reader's browser. `scripts/validate-privacy.mjs`
 * fails the build when the product and the page disagree.
 *
 * IT IS ORDINARY PROSE, not boilerplate. There is no "we may share your data
 * with our trusted partners", because there are no partners; no retention
 * schedule, because nothing here retains anything on a schedule GCI controls;
 * and no consent theatre, because there is nothing yet to consent to in the
 * product this policy's reader is most likely using.
 */

const title = "Privacy";
const description =
  "What Global City Intelligence collects, what stays in your browser, and who your browser talks to when you use the site.";
const breadcrumbs = staticBreadcrumbs("Privacy", staticRoutes.privacy);

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.privacy,
});

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="max-w-2xl space-y-4 text-[15px] leading-7 text-text-body">{children}</div>;
}

export default function PrivacyPage() {
  const openBlockers = PRIVACY_BLOCKERS.filter((blocker) => blocker.id === "operator-identity");

  return (
    <main>
      <JsonLd data={webpageSchema({ path: staticRoutes.privacy, title, description })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <PageHeader eyebrow="Privacy" intro={description} title={title} />

      {/* A single readable column. A legal page is read, not scanned in a grid. */}
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbs} />

        <Prose>
          <p className="text-sm text-text-muted">Prepared {PRIVACY_PREPARED_ON}.</p>
          <p>
            Global City Intelligence publishes city and country data. This page covers the main
            site, GCI Places at{" "}
            <span className="whitespace-nowrap">globalcityintelligence.com/places/</span> and GCI
            Media at <span className="whitespace-nowrap">globalcityintelligence.com/blog/</span>.
          </p>
          <p>
            The short version: there are no accounts, GCI sets no cookies, and anything you write
            while using GCI Places — the names of your lists, the titles and locations of your own
            pins, and your private notes — stays in your browser and is never sent to us.
          </p>
        </Prose>

        <section>
          <SectionHeading title="Who runs this site" />
          <Prose>
            {PRIVACY_OPERATOR.legalEntity && PRIVACY_OPERATOR.contact ? (
              <p>
                {PRIVACY_OPERATOR.displayName} is operated by {PRIVACY_OPERATOR.legalEntity}.
                {PRIVACY_OPERATOR.postalAddress ? ` ${PRIVACY_OPERATOR.postalAddress}.` : ""} For
                privacy questions, contact {PRIVACY_OPERATOR.contact}.
              </p>
            ) : (
              /*
               * An explicit gap rather than an invented controller.
               *
               * Nothing in this project publishes a legal entity or a contact
               * address. Naming one here would misstate who is accountable,
               * which is the single fact a reader most needs — so the page
               * says so plainly, and the release checklist blocks publication
               * until it is filled in.
               */
              <p>
                {PRIVACY_OPERATOR.displayName} is a publishing project in the HELPERG family of
                sites. A registered operator name and a contact address for privacy questions have
                not yet been published here, and this page will name them once they are. Until
                then, the rest of this page still describes accurately what the site does.
              </p>
            )}
            {openBlockers.length > 0 ? null : null}
          </Prose>
        </section>

        <section>
          <SectionHeading title="Reading the site" />
          <Prose>
            <p>
              These sites are static files served by a host. There is no GCI application server,
              no database and no login — but a static site is still fetched over the internet, so
              the ordinary details of a web request reach the host: the address you asked for, your
              IP address, and the identifying string your browser sends about itself. That is how
              the web works rather than something GCI added, and GCI does not build profiles from
              it.
            </p>
            <p>
              You do not need an account to use anything here, and there is nothing to sign up for.
            </p>
          </Prose>
        </section>

        <section>
          <SectionHeading title="Cookies" />
          <Prose>
            <p>
              GCI sets no cookies. The one cookie you may see comes from Wikimedia Commons, which
              hosts many of the photographs on the site; your browser receives it when it fetches
              an image, and GCI neither sets nor reads it.
            </p>
            <p>
              Some things are stored in your browser&rsquo;s local storage instead. Those are listed
              below, and you can clear all of them.
            </p>
          </Prose>
        </section>

        <section>
          <SectionHeading title="What GCI Places keeps in your browser" />
          <Prose>
            <p>
              GCI Places lets you save places and collections, group them into your own lists, drop
              private pins on your own map, and write private notes. All of it is stored in the
              browser you are using, on the device you are using.
            </p>
            <p>
              <strong>There is no account and no sync.</strong> Nothing is copied to a GCI server,
              nothing moves between your devices, and there is no backup. Clearing your browser
              data clears it, and a different browser or device starts empty.
            </p>
            <p>
              Your list names, your pin titles, the locations you choose for your pins, and your
              private notes are <strong>never transmitted to GCI</strong>. That is a property of how
              the product is built, not a promise about intentions: the code that would send
              anything cannot express those values at all.
            </p>
            <p>
              You can remove everything with <em>Clear saved data</em> on the Saved page. That
              clears the GCI Places storage listed below and nothing else — it does not touch other
              sites, your browser cache, or your browser history.
            </p>
          </Prose>
        </section>

        <section>
          <SectionHeading title="Things stored in your browser" />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-border text-text-muted">
                  <th className="py-2 pr-4 font-medium">Stored as</th>
                  <th className="py-2 pr-4 font-medium">Where</th>
                  <th className="py-2 pr-4 font-medium">What it holds</th>
                  <th className="py-2 font-medium">How to remove it</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_LOCAL_STORAGE.map((entry) => (
                  <tr className="border-b border-neutral-border/60 align-top" key={entry.key}>
                    <td className="py-3 pr-4">
                      <code className="break-all text-[13px]">{entry.key}</code>
                    </td>
                    <td className="py-3 pr-4">{entry.product}</td>
                    <td className="py-3 pr-4">{entry.holds}</td>
                    <td className="py-3">{entry.control}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <SectionHeading title="Measuring how the site is used" />
          <Prose>
            <p>
              <strong>The main site</strong> uses WebmasterID to count visits and see which pages
              are read. It stores a random identifier in your browser — in local storage, not a
              cookie — so that repeat visits from the same browser are counted once rather than many
              times. That identifier is not a name and is not linked to an account, because there
              are no accounts; but it does persist, so it can connect your visits to this site over
              time until you clear your browser data.
            </p>
            <p>
              If your browser sends <em>Do Not Track</em>, or if you have{" "}
              <em>Global Privacy Control</em> switched on, the measurement script does not start at
              all: no identifier is created and nothing is sent.
            </p>
            <p>
              <strong>GCI Places currently measures nothing.</strong> It loads no measurement script
              and sends no usage data. We may switch on a limited form of measurement there in
              future, to answer questions like &ldquo;do people who save a place come back to
              it?&rdquo;. If we do, it will record <em>that</em> an action happened — a place saved,
              a list created, a map opened — along with which city and category it concerned, and a
              rough sense of how much you have saved. It will never include your list names, your
              pin titles, your pin locations or your notes. This page will say so before that
              changes.
            </p>
          </Prose>
        </section>

        <section>
          <SectionHeading title="Who your browser talks to" />
          <Prose>
            <p>
              These are the services a page may contact directly from your browser. Each one
              receives the ordinary details of a web request; what else it receives is described
              here. They are listed because they were observed, not because they might be used.
            </p>
          </Prose>
          <div className="mt-4 space-y-5">
            {PRIVACY_THIRD_PARTIES.map((party) => (
              <div className="max-w-2xl" key={party.id}>
                <h3 className="text-[15px] font-semibold text-text-strong">{party.name}</h3>
                <p className="text-sm text-text-muted">
                  {party.role} · {party.surfaces}
                </p>
                <p className="mt-1 text-[15px] leading-7 text-text-body">{party.receives}</p>
              </div>
            ))}
          </div>
          <Prose>
            <p className="mt-5">
              Each of these handles what it receives according to its own practices, which GCI does
              not control and cannot describe on their behalf.
            </p>
          </Prose>
        </section>

        <section>
          <SectionHeading title="What is not here" />
          <Prose>
            <p>
              No advertising, no advertising identifiers, no social media trackers, no email
              collection, no newsletter, no comments, no reviews, no user profiles, and nothing
              sold or shared with anyone. GCI does not use Google Analytics, Meta pixels or any
              similar service.
            </p>
            <p>
              GCI Places is a static site with no server component: it has no ability to receive
              your saved data, because there is nowhere for it to arrive.
            </p>
          </Prose>
        </section>

        <section>
          <SectionHeading title="If accounts are ever added" />
          <Prose>
            <p>
              There are no accounts today and none is being built. If GCI ever offers one — so that
              saved places could follow you between devices — that would change where your data
              lives and who can reach it, and it would need its own review and its own description
              here. Nothing on this page should be read as covering a system that does not exist.
            </p>
          </Prose>
        </section>

        <section>
          <SectionHeading title="Changes to this page" />
          <Prose>
            <p>
              This page is versioned with the site&rsquo;s source code, and the date at the top
              changes when it does. Where a statement here describes something the product does,
              an automated check fails the build if the two stop agreeing — so this page going stale
              is a build error rather than something nobody notices.
            </p>
            {PRIVACY_FACTS.placesRetentionAnalyticsEnabled ? null : (
              <p className="text-sm text-text-muted">
                At the time this page was prepared, usage measurement in GCI Places was switched
                off.
              </p>
            )}
          </Prose>
        </section>
      </div>
    </main>
  );
}
