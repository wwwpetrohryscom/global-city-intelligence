import Link from "next/link";
import { ImageAttribution } from "@/components/media/ImageAttribution";
import { Card } from "@/components/ui/Card";
import { ScoreBar } from "@/components/ui/score-bar";
import { getCityHeroImage } from "@/lib/data/media/queries";
import { cityRoute } from "@/lib/seo/routes";
import type { City } from "@/types";

export function CityCard({ city }: { city: City }) {
  const hero = getCityHeroImage(city.slug);
  const aspectStyle =
    hero?.width && hero.height
      ? { aspectRatio: `${hero.width} / ${hero.height}` }
      : { aspectRatio: "16 / 9" };

  return (
    <Card interactive>
      {hero ? (
        <figure className="-mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl border-b border-neutral-border bg-neutral-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={hero.alt}
            className="block h-auto w-full object-cover"
            decoding="async"
            height={hero.height}
            loading="lazy"
            sizes="(min-width: 1280px) 18rem, (min-width: 768px) 50vw, 100vw"
            src={hero.src}
            style={aspectStyle}
            width={hero.width}
          />
          <figcaption className="px-4 py-2">
            <ImageAttribution image={hero} />
          </figcaption>
        </figure>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">
            <Link className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline" href={cityRoute(city.slug)}>
              {city.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            {city.countryName} / {city.region}
          </p>
        </div>
        <span className="rounded-full border border-brand-400 bg-orange-50 px-3 py-1 text-sm font-semibold text-text-primary">
          {city.scores.overall}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-text-secondary">{city.outlook}</p>
      <div className="mt-5">
        <ScoreBar label="Overall" value={city.scores.overall} />
      </div>
    </Card>
  );
}
