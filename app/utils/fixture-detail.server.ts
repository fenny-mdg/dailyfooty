import { request } from "undici";

import db from "~/utils/db.server.ts";

import {
  FixtureDetailDTO,
  FixtureEvent,
  FixtureEventValue,
  Incident,
  Score,
  Team,
} from "./fixture-detail.ts";
import { getFixture } from "./fixture.server.ts";

type FixtureDetail = {
  id: string;
  pageProps: {
    __N_REDIRECT?: string;
    initialEventData: {
      isError: boolean;
      event: {
        categoryName: string;
        competitionId: string;
        countryId: string;
        finishDateTimeString: string;
        flagAlt: string;
        flagUrl: string;
        homeTeamScore: string;
        awayTeamScore: string;
        homeTeamName: string;
        awayTeamName: string;
        homeTeamId: string;
        awayTeamId: string;
        homeTeamBadge: {
          high: string;
          medium: string;
        };
        awayTeamBadge: {
          high: string;
          medium: string;
        };
        isActive: boolean;
        isEventOutdated: boolean;
        isFinishedAfterPenalties: boolean;
        incidents: {
          hasAssists: boolean;
          incs: {
            [key in
              | "football1"
              | "football2"
              | "football3"
              | "football4"]: Record<
              string,
              { AWAY: Incident[]; HOME: Incident[] }[]
            >;
          };
        };
        scores: {
          aggregateAwayScore?: string;
          aggregateHomeScore?: string;
          awayOvertimeScore: string;
          awayTeamName: string;
          awayTeamScore: string;
          homeOvertimeScore: string;
          homeTeamName: string;
          homeTeamScore: string;
          penaltyAwayScore: number;
          penaltyHomeScore: number;
        };
        stageId: string;
        stageName: string;
        winner: string;
        winnerId: string;
      };
    };
  };
};

const extractImageKey = (url: string) => {
  const { pathname } = new URL(url);
  const [, ...restPathName] = pathname.split("/").filter(Boolean);

  return restPathName.join("/");
};

const mapPeriod = (
  period?: Record<string, { AWAY: Incident[]; HOME: Incident[] }[]>,
) =>
  period
    ? Object.keys(period).reduce<FixtureEventValue>((res, key) => {
        const mappedValue = period[key].map(({ AWAY: away, HOME: home }) => ({
          away,
          home,
        }));

        res[key] = mappedValue;

        return res;
      }, {})
    : {};

const formatFixtureDetail = (
  fixtureDetail: FixtureDetail,
): FixtureDetailDTO | null => {
  if (!fixtureDetail.pageProps.initialEventData) {
    return null;
  }

  const {
    id,
    pageProps: {
      initialEventData: {
        event: {
          homeTeamId,
          homeTeamName,
          homeTeamBadge: { medium: homeTeamMediumBadge },
          awayTeamId,
          awayTeamName,
          awayTeamBadge: { medium: awayTeamMediumBadge },
          scores: {
            homeTeamScore,
            homeOvertimeScore,
            penaltyHomeScore,
            aggregateHomeScore,
            awayTeamScore,
            awayOvertimeScore,
            penaltyAwayScore,
            aggregateAwayScore,
          },
          incidents,
        },
      },
    },
  } = fixtureDetail;
  const {
    incs: {
      football1: firstPeriodRaw,
      football2: secondPeriodRaw,
      football3: overtimeRaw,
    },
  } = incidents || { incs: { football1: {}, football2: {}, football3: {} } };
  const homeTeam: Team = {
    id: homeTeamId,
    name: homeTeamName,
    img: extractImageKey(homeTeamMediumBadge),
  };
  const awayTeam: Team = {
    id: awayTeamId,
    name: awayTeamName,
    img: extractImageKey(awayTeamMediumBadge),
  };

  const scores: Score = {
    finalScore:
      homeTeamScore && awayTeamScore ? [homeTeamScore, awayTeamScore] : null,
    overtimeScore:
      homeOvertimeScore && awayOvertimeScore
        ? [homeOvertimeScore, awayOvertimeScore]
        : null,
    penaltyScore: [penaltyHomeScore, penaltyAwayScore],
    aggregateScore:
      aggregateHomeScore && aggregateAwayScore
        ? [aggregateHomeScore, aggregateAwayScore]
        : null,
  };
  const firstPeriod = mapPeriod(firstPeriodRaw);
  const secondPeriod = mapPeriod(secondPeriodRaw);
  const overtime = mapPeriod(overtimeRaw);
  const events: FixtureEvent = {
    firstPeriod,
    secondPeriod,
    overtime,
  };

  return { id, homeTeam, awayTeam, scores, events };
};

const fixtureCollectionName = "ls_fixture_detail";

export const getFixtureDetail = async (id: FixtureDetailDTO["id"]) => {
  const fixtureDetailCollection = db?.collection<FixtureDetail>(
    fixtureCollectionName,
  );
  const fixtureDetail = await fixtureDetailCollection?.findOne({
    id,
  });

  if (!fixtureDetail?.pageProps?.initialEventData) {
    const fixture = await getFixture(id);
    if (!fixture) {
      return null;
    }

    const {
      competition: { tag, countryTag, countryAltName },
      homeTeam: { name: homeTeamName },
      awayTeam: { name: awayTeamName },
      fixtureDate,
    } = fixture;

    try {
      const defaultBuildId = "0ZdbI-Nf6GsJBYU7Bv2ik";
      const [, newBuildId] =
        fixtureDetail?.pageProps?.__N_REDIRECT?.split("buildid=") || [];
      const buildId = newBuildId || defaultBuildId;
      const urls = [
        ...new Set([
          `https://www.livescore.com/_next/data/${buildId}/en/football/${countryAltName?.toLowerCase()}/${tag.toLowerCase()}/${homeTeamName.toLowerCase()}-vs-${awayTeamName.toLowerCase()}/${id}.json?sport=football&eventId=${id}`,
          `https://www.livescore.com/_next/data/${buildId}/en/football/${countryTag?.toLowerCase() || countryAltName?.toLowerCase()}/${tag.toLowerCase()}/${homeTeamName.toLowerCase()}-vs-${awayTeamName.toLowerCase()}/${id}.json?sport=football&eventId=${id}`,
        ]),
      ];
      const requests = urls.map((url) => request(url));
      const results = (await Promise.allSettled(requests)).filter(
        (res) => res.status === "fulfilled",
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore value error
      const bodyJsons = results.map(({ value }) => value.body.json());
      const [data] = await Promise.all(bodyJsons);

      if (!data || data?.notFound) {
        return null;
      }

      await fixtureDetailCollection?.updateOne(
        { id },
        { $set: { ...data, fixtureDate } },
        { upsert: true },
      );

      return formatFixtureDetail(data);
    } catch (e) {
      console.error("Error occurs but continue others", e);
    }
    return null;
  }

  return formatFixtureDetail(fixtureDetail);
};
