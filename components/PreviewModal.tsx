"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { AnimatePresence } from "framer-motion";
import { RxCross2 } from "react-icons/rx";

import { FallbackImage, MotionDiv } from "@components";
import {
  CreditList,
  Director,
  GenreList,
  NetworkList,
} from "@components/Common";

import { usePreview } from "@contexts/PreviewContext";
import { IGetMovieDetailsResponse } from "@types";

import { parentModalVariants, previewModalVariants } from "@lib/utils/motion";
import { convertRuntime, roundedToFixed, slugify } from "@lib/helpers/helpers";

const PreviewModal = () => {
  const { previewId, previewMediaType, close } = usePreview();
  const [isOpen, setIsOpen] = useState(false);

  const [data, setData] = useState<IGetMovieDetailsResponse | null>(null);

  const isMobile = useMediaQuery({ query: "(max-width: 641px)" });

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const response = await fetch(
          `/api/preview?mediaType=${previewMediaType}&id=${previewId}`
        );

        const data = await response.json();

        if (response.ok) {
          setData(data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching next page:", error);
      }
    };

    if (previewId) {
      loadPreview();
    }
  }, [previewId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle escape key and body scroll lock
  useEffect(() => {
    if (previewId) {
      setIsOpen(true);
      document.body.classList.add("modal-open");
    } else {
      setIsOpen(false);
      setData(null);
      document.body.classList.remove("modal-open");
    }
  }, [previewId, close]);

  return (
    <AnimatePresence>
      {isOpen && data && (
        <MotionDiv
          key="modal"
          variants={parentModalVariants(0.15)}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[9999] flex items-center justify-center max-sm:items-end"
        >
          {/* Blurred background */}
          <MotionDiv
            variants={parentModalVariants()}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
          />

          {/* Modal content */}
          <MotionDiv
            variants={previewModalVariants(isMobile)}
            initial="hidden"
            animate="show"
            exit="exit"
            className="p-7 py-9 bg-dark-1/75 relative z-10 w-full 
                        max-w-xl max-lg:max-w-lg max-sm:max-w-full
                        rounded-md max-sm:rounded-none"
          >
            {/* POSTER AND INFORMATION */}
            <div className="w-full h-full flex gap-3">
              {/* POSTER */}
              <div className="relative bg-dark rounded-lg w-20 h-28">
                <FallbackImage
                  src={data.details.poster_path}
                  mediaType={previewMediaType}
                  alt="poster"
                  fill
                  sizes="80px"
                  placeholder="blur"
                  blurDataURL="/images/blur.jpg"
                  className="object-cover rounded-lg opacity-90"
                />
              </div>

              {/* INFORMATION */}
              <div className="flex flex-1 flex-col">
                {/* TITLE */}
                <Link
                  href={`/title/${previewMediaType}/${previewId}-${slugify(
                    data.details.title || data.details.name || "untitled"
                  )}`}
                  title={data.details.title || data.details.name}
                  className="inline-block w-fit"
                  onClick={close}
                >
                  <h3 className="font-semibold text-lg text-light hover:text-tale">
                    {data.details.title || data.details.name}
                  </h3>
                </Link>

                {/* RELEASE & RUNTIME */}
                <div
                  className="pt-1 text-light-1 text-sm max-sm:text-xs
                      flex flex-wrap items-center gap-2"
                >
                  {/* RELEASE DATE */}
                  {previewMediaType === "movie" && data?.releaseDate?.date ? (
                    <p>{moment(data.releaseDate.date).format("YYYY")}</p>
                  ) : (
                    previewMediaType === "tv" &&
                    data?.details?.first_air_date && (
                      <p>
                        {moment(data.details.first_air_date).format("YYYY")}
                      </p>
                    )
                  )}

                  {((previewMediaType === "movie" && data?.releaseDate?.date) ||
                    (previewMediaType === "tv" &&
                      data.details.first_air_date)) &&
                    ((previewMediaType === "movie" &&
                      data.details.runtime &&
                      data.details.runtime > 0) ||
                      (previewMediaType === "tv" &&
                        data.details.number_of_seasons &&
                        data.details.number_of_seasons > 0)) && (
                      <span className="">&#8226;</span>
                    )}

                  {/* RUNTIME OR SEASONS */}
                  {previewMediaType === "movie" &&
                  data.details.runtime &&
                  data.details.runtime > 0 ? (
                    <p className="">{convertRuntime(data.details.runtime)}</p>
                  ) : (
                    previewMediaType === "tv" &&
                    data.details.number_of_seasons &&
                    data.details.number_of_seasons > 0 && (
                      <p>{`${data.details.number_of_seasons} Seasons`}</p>
                    )
                  )}

                  {((previewMediaType === "movie" &&
                    data.details.runtime &&
                    data.details.runtime > 0) ||
                    (previewMediaType === "tv" &&
                      data.details.number_of_seasons &&
                      data.details.number_of_seasons > 0)) &&
                    ((previewMediaType === "movie" &&
                      data?.releaseDate?.certification) ||
                      (previewMediaType === "tv" && data?.ratings?.rating)) && (
                      <span className="">&#8226;</span>
                    )}

                  {/* RATING */}
                  {previewMediaType === "movie" &&
                  data?.releaseDate?.certification ? (
                    <p className="">{data.releaseDate.certification}</p>
                  ) : (
                    previewMediaType === "tv" &&
                    data?.ratings?.rating && (
                      <p className="">{data.ratings.rating}</p>
                    )
                  )}

                  {((previewMediaType === "movie" &&
                    data?.releaseDate?.certification) ||
                    (previewMediaType === "tv" && data?.ratings?.rating)) &&
                    previewMediaType === "tv" &&
                    data.details.networks && <span className="">&#8226;</span>}

                  {/* NETWORKS FOR TV */}
                  {previewMediaType === "tv" && data.details.networks && (
                    <>
                      <NetworkList
                        mediaType={previewMediaType}
                        networks={data.details.networks}
                        containerStyles="w-[32px] h-[20px] max-sm:w-[29px] h-[17px]"
                      />
                    </>
                  )}
                </div>

                {/* GENRE */}
                <div className="pt-1 text-light-1 flex flex-wrap items-center gap-2 gap-y-1">
                  <GenreList
                    mediaType={previewMediaType}
                    genres={data.details.genres}
                    containerStyles="text-sm max-sm:text-xs"
                    childStyles="text-sm max-sm:text-xs"
                    handleClick={close}
                  />
                </div>

                {/* RATING */}
                <div className="pt-2.5 flex items-center gap-1">
                  <Image
                    src="/icons/star-2.svg"
                    alt="Rating Star"
                    width={0}
                    height={0}
                    sizes="18px"
                    className="w-[18px] h-[18px] max-sm:w-4 max-sm:h-4
                          relative object-contain bottom-[1.7px]"
                  />

                  <span
                    className={`text-lg max-sm:text-base text-light-1
                                        ${
                                          data.details.vote_average &&
                                          data.details.vote_average > 0
                                            ? "font-semibold"
                                            : "font-normal italic"
                                        }`}
                  >
                    {data.details.vote_average && data.details.vote_average > 0
                      ? roundedToFixed(data.details.vote_average, 1)
                      : "NaN"}
                  </span>
                </div>
              </div>
            </div>

            {/* OVERVIEW */}
            <div className="pt-7 max-sm:pt-5">
              <p className="text-light text-sm max-sm:text-xs">
                {data.details.overview}
              </p>
            </div>

            {/* CREDITS */}
            <div className="pt-5 text-light">
              {(data.credits.crew.length > 0 || data.details.created_by) && (
                <div className="grid grid-cols-[15%_1fr]
                      max-lg:grid-cols-[18%_1fr] gap-x-2
                      items-baseline font-semibold"
                >
                  <h3 className="text-sm max-sm:text-xs">
                    {previewMediaType === "movie" ? "Director" : "Creators"}
                  </h3>

                  {previewMediaType === "movie" ? (
                    <Director
                      crews={data.credits.crew}
                      childStyles="text-xs max-sm:text-[0.675rem]"
                      handleClick={close}
                    />
                  ) : (
                    <div className="text-xs flex flex-wrap items-center gap-2">
                      <CreditList
                        items={data.details.created_by ?? []}
                        childStyles="text-xs max-sm:text-[0.675rem]"
                        handleClick={close}
                      />
                    </div>
                  )}
                </div>
              )}

              {data.credits.cast.length > 0 && (
                <div className="pt-2 grid grid-cols-[15%_1fr] 
                      max-lg:grid-cols-[18%_1fr] gap-x-2
                      items-baseline font-semibold"
                >
                  <h3 className="text-sm max-sm:text-xs">
                    Stars
                  </h3>

                  <div className="flex flex-wrap items-center gap-2">
                    <CreditList
                      items={data.credits.cast}
                      childStyles="text-xs max-sm:text-[0.675rem]"
                      handleClick={close}
                    />
                  </div>
                </div>
              )}
            </div>

            <RxCross2
              className="absolute top-[-11%] max-sm:top-[-13%]
                  max-xs:top-[-11%] right-1 text-4xl max-xs:text-3xl
                  text-danger cursor-pointer hover:text-danger/55"
              onClick={close}
            />
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default PreviewModal;
