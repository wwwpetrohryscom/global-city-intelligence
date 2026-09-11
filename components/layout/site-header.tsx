import { BrandMark } from "@/components/layout/BrandMark";
import { Container } from "@/components/layout/Container";
import { PrimaryNav } from "@/components/layout/PrimaryNav";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

/**
 * The site header.
 *
 * One row at every desktop width: brand, navigation, search. The navigation no
 * longer scrolls sideways (see PrimaryNav), and the search is a compact
 * trigger rather than a 16rem field, which is what freed the space the links
 * needed.
 *
 * ON THE "FIND A CITY" / SEARCH OVERLAP: the two are not the same tool. The
 * search trigger jumps to a city or country you can already name; /explore-cities
 * is a 13-facet finder for when you cannot. Both are kept — but the nav entry
 * is labelled "City Finder", not "Find a city", because a link labelled like a
 * search box sitting next to a search box is the duplication a visitor
 * actually experiences.
 *
 * `relative` is load-bearing: the narrow-width navigation panel positions
 * itself against this element.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-[var(--ecosystem-bar-height)] z-30 border-b border-eco-100 bg-white/95 shadow-[0_1px_0_rgba(23,32,51,0.02)] backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <Container className="relative flex items-center gap-2 py-2.5 md:gap-3">
        <BrandMark size="md" tone="accent" />
        <PrimaryNav />
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          {/*
            The language switch renders only on a page that HAS a translation,
            and decides that from the page's own hreflang links — the same
            elements the SEO cluster uses, so the two cannot disagree. On a page
            with no counterpart it renders nothing at all, which is why it costs
            no space on the 84,000 English-only pages.
          */}
          <LanguageSwitcher />
          <GlobalSearch />
        </div>
      </Container>
    </header>
  );
}
