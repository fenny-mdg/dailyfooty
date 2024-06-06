import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { FixtureList } from "@/components/ui/fixture-list.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { cn } from "@/lib/utils.ts";
import { dateAdd } from "~/utils/date-time.ts";
import { getFixtures } from "~/utils/fixture.server.ts";
import { FixtureDTO } from "~/utils/fixture.ts";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const { searchParams } = url;
  const selectedDate = searchParams.get("selectedDate");
  let wantedDate = new Date();

  if (selectedDate) {
    const [day, month, year] = selectedDate.split("/");

    wantedDate = new Date(Number(year), Number(month) - 1, Number(day));
  }

  const fixtures = await getFixtures({ fixtureDate: wantedDate });

  return json({ fixtures });
};

export default function FixtureIndexPage() {
  const { fixtures } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const fixtureGroupedByCompetitions = fixtures.reduce<
    Record<
      string,
      {
        order: number;
        competition: FixtureDTO["competition"];
        fixtures: FixtureDTO[];
      }
    >
  >((group, fixture, index) => {
    const { competition } = fixture;
    const { id: competitionId } = competition;

    if (!group[competitionId]) {
      group[competitionId] = { order: index, competition, fixtures: [] };
    }

    // @ts-expect-error Type issue
    group[competitionId].fixtures.push(fixture);

    return group;
  }, {});
  const competitionIds = Object.keys(fixtureGroupedByCompetitions).sort(
    (id1, id2) => {
      const order1 = fixtureGroupedByCompetitions[id1].order;
      const order2 = fixtureGroupedByCompetitions[id2].order;

      return order1 - order2;
    },
  );
  const startDate = dateAdd(new Date(), -2, "day");
  const fixtureDates = Array.from({ length: 5 }, (_, index) =>
    dateAdd(startDate, index, "day"),
  ).map((date) => ({
    label: Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
    }).format(date),
    value: Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
    }).format(date),
  }));
  const defaultSelectedTab =
    searchParams.get("selectedDate") ||
    Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
    }).format(new Date());
  const handleDateChanged = (value: string) => {
    searchParams.set("selectedDate", value);
    setSearchParams(searchParams);
  };
  const handleCalendarSelect = (newDate?: Date) => {
    if (newDate) {
      setCalendarDate(newDate);
      searchParams.set(
        "selectedDate",
        Intl.DateTimeFormat("en-GB", {
          dateStyle: "short",
        }).format(newDate),
      );
      setSearchParams(searchParams);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-12">
      <div className="w-full flex overflow-scroll">
        <Tabs defaultValue={defaultSelectedTab} className="flex-1">
          <TabsList className="flex items-start justify-normal">
            {fixtureDates.map((date) => (
              <TabsTrigger
                key={date.value}
                value={date.value}
                className="flex-1"
                onClick={() => handleDateChanged(date.value)}
              >
                {date.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(" justify-start text-left font-normal")}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={handleCalendarSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {competitionIds.map((competitionId: string) => {
        const { competition, fixtures: currentFixtures } =
          fixtureGroupedByCompetitions[competitionId];

        return (
          <div key={competitionId}>
            <div>
              <div className="mb-4">
                <h4 className="font-medium">{competition.name}</h4>
                <p className="text-xs">{competition.countryName}</p>
              </div>
              <FixtureList fixtures={currentFixtures} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
