import Link from "next/link";
import Image from "next/image";
import moment from "moment";

import { FallbackImage } from "@components";

import type { CreditItem, IPersonKnownForProps } from "@types";

import { roundedToFixed, slugify } from "@lib/helpers/helpers";

const PersonKnownFor = ({ works }: IPersonKnownForProps) => {
  const sortedWorks = works
    .slice()
    .sort(
      (a: CreditItem, b: CreditItem) =>
        b.vote_count - a.vote_count || (b.popularity ?? 0) - (a.popularity ?? 0)
    );

  return (
    <>
      <h3 className="text-main text-2xl max-sm:text-xl font-semibold">
        Known For
      </h3>

      {/* LIST OF WORKS */}
      <div
        className="pt-7 grid grid-cols-8 max-xs:grid-cols-1 gap-3"
      >
        {sortedWorks.slice(0, 4).map((work, index: number) => (
          // POSTER
          <div
            key={work.id}
            className={`col-span-4
              h-[138px] max-sm:h-[127px] max-xs:h-[128px]
              max-2xs:h-[120px] flex gap-2 max-sm:gap-1
              bg-light shadow-inner shadow-dark-1
              rounded-tr-xl rounded-bl-xl
              ${index >= 2 && "max-sm:hidden"}`}
          >
            <Link
              href={`/title/${work.media_type}/${work.id}-${slugify(
                work.title || work.name || "Untitled"
              )}`}
              className="relative w-[20%] max-md:w-[25%]
                max-xs:w-[23%] h-full
                bg-dark group rounded-bl-xl"
            >
              <FallbackImage
                src={work.poster_path}
                mediaType={work.media_type ?? ""}
                alt="poster"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                placeholder="blur"
                blurDataURL="/images/blur.jpg"
                className="object-cover rounded-bl-xl opacity-90
                  transition-opacity duration-100 group-hover:opacity-55"
              />
            </Link>

            {/* WORKS DETAILS */}
            <div className="w-full flex-1 text-dark py-2 px-3">
              <div className="flex justify-between">
                {/* Title */}
                <Link
                  href={`/title/${work.media_type}/${work.id}-${slugify(
                    work.title || work.name || "Untitled"
                  )}`}
                >
                  <h4
                    className="line-clamp-2 font-semibold
                    max-sm:text-sm max-xs:text-base
                    max-2xs:text-sm capitalize hover:text-tale"
                  >
                    {work.title || work.name}
                  </h4>
                </Link>

                {/* Desktop Rating */}
                <div className="max-lg:hidden flex items-center gap-1">
                  <Image
                    src="/icons/star-2.svg"
                    alt="Rating Star"
                    width={18}
                    height={18}
                    sizes="18px"
                    className="relative object-contain bottom-[1.5px]"
                  />

                  <span
                    className={`text-dark-1 ${
                      work.vote_average && work.vote_average > 0
                        ? "font-semibold"
                        : "font-normal italic"
                    }`}
                  >
                    {work.vote_average && work.vote_average > 0
                      ? roundedToFixed(work.vote_average, 1)
                      : "NaN"}
                  </span>
                </div>
              </div>

              {/* Release date */}
              <div className="max-lg:hidden text-dark-1">
                {moment(work.release_date || work.first_air_date).format(
                  "YYYY"
                )}
              </div>

              {/* Mobile Rating */}
              <div className="hidden pt-2 max-lg:flex items-center gap-5">
                <div className="flex items-center gap-1">
                  <Image
                    src="/icons/star-2.svg"
                    alt="Rating Star"
                    width={14}
                    height={14}
                    sizes="14px"
                    className="relative object-contain bottom-[1.5px]"
                  />

                  <span
                    className={`text-dark-1 max-sm:text-sm 
                        max-xs:text-base max-2xs:text-sm ${
                      work.vote_average && work.vote_average > 0
                        ? "font-semibold"
                        : "font-normal italic"
                    }`}
                  >
                    {work.vote_average && work.vote_average > 0
                      ? roundedToFixed(work.vote_average, 1)
                      : "NaN"}
                  </span>
                </div>

                <div className="text-dark-1 max-sm:text-sm
                      max-xs:text-base max-2xs:text-sm">
                  {moment(work.release_date || work.first_air_date).format(
                    "YYYY"
                  )}
                </div>
              </div>

              <p className="pt-4 font-medium text-dark-1 
                    max-md:text-sm max-xs:text-base max-2xs:text-sm"
              >
                {work.character}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PersonKnownFor;
