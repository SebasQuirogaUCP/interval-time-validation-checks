import { Group, Stack, Text, Title } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useEffect, useState } from "react";

const Time24FormatToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const TimeInputs = () => {
  const [availableStartTime, setAvailableStartTime] = useState("");
  const [availableEndTime, setAvailableEndTime] = useState("");
  const [testStartTime, setTestStartTime] = useState("");
  const [testEndTime, setTestEndTime] = useState("");
  const [overlaps, setOverlaps] = useState(true);

  useEffect(() => {
    if (
      !availableStartTime ||
      !availableEndTime ||
      !testStartTime ||
      !testEndTime
    ) {
      setOverlaps(true);
      return;
    }

    const checkSegmentOverlap = (
      segment1: { start: number; end: number },
      segment2: { start: number; end: number }
    ) => {
      return segment1.start < segment2.end && segment2.start < segment1.end;
    };

    const availableStart = Time24FormatToMinutes(availableStartTime);
    const availableEnd = Time24FormatToMinutes(availableEndTime);
    const testStart = Time24FormatToMinutes(testStartTime);
    const testEnd = Time24FormatToMinutes(testEndTime);

    // Handle special case of midnight (0 minutes)
    // If end time is midnight (0), treat it as end of day (1440 minutes)
    const adjAvailEnd = availableEnd === 0 ? 1440 : availableEnd;
    const adjTestEnd = testEnd === 0 ? 1440 : testEnd;

    // Check if each range crosses midnight
    const availCrossesMidnight = availableStart >= adjAvailEnd;
    const testCrossesMidnight = testStart >= adjTestEnd;

    // For each range, create two "day segments" that represent
    // the parts of the range before and after midnight
    const availFirstDay = {
      start: availableStart,
      end: availCrossesMidnight ? 1440 : adjAvailEnd,
    };
    const availSecondDay = availCrossesMidnight
      ? { start: 0, end: adjAvailEnd }
      : null;

    const testFirstDay = {
      start: testStart,
      end: testCrossesMidnight ? 1440 : adjTestEnd,
    };
    const testSecondDay = testCrossesMidnight
      ? { start: 0, end: adjTestEnd }
      : null;

    // Check for overlap between all possible day segment combinations
    const firstDayOverlap = checkSegmentOverlap(availFirstDay, testFirstDay);

    const secondDayOverlap =
      availSecondDay &&
      testSecondDay &&
      checkSegmentOverlap(availSecondDay, testSecondDay);

    const crossDayOverlap1 =
      availSecondDay && checkSegmentOverlap(availSecondDay, testFirstDay);

    const crossDayOverlap2 =
      testSecondDay && checkSegmentOverlap(availFirstDay, testSecondDay);

    // If any segment combination overlaps, the ranges overlap
    const hasOverlap =
      firstDayOverlap ||
      secondDayOverlap ||
      crossDayOverlap1 ||
      crossDayOverlap2;

    setOverlaps(hasOverlap ?? false);
  }, [availableStartTime, availableEndTime, testStartTime, testEndTime]);

  return (
    <Stack className="p-6 bg-white rounded-lg shadow-lg">
      <Title className="text-xl font-semibold text-gray-800">
        Available window time
      </Title>
      <Text fw={200}>Define your availability window</Text>
      <Group grow className="gap-4">
        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg shadow-md w-64">
          <label className="text-sm font-medium text-gray-700">
            Available start time
          </label>
          <TimeInput
            value={availableStartTime}
            onChange={(event) =>
              setAvailableStartTime(event.currentTarget.value)
            }
            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <p className="text-xs text-gray-500">Choose your starting time.</p>
        </div>

        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg shadow-md w-64">
          <label className="text-sm font-medium text-gray-700">
            Available end time
          </label>
          <TimeInput
            value={availableEndTime}
            onChange={(event) => setAvailableEndTime(event.currentTarget.value)}
            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <p className="text-xs text-gray-500">Choose your ending time.</p>
        </div>
      </Group>

      <Title className="text-xl font-semibold text-gray-800">
        Test window time
      </Title>
      <Text fw={200}>Set a testing time range</Text>
      <Group grow className="gap-4">
        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg shadow-md w-64">
          <label className="text-sm font-medium text-gray-700">
            Testing start time
          </label>
          <TimeInput
            value={testStartTime}
            onChange={(event) => setTestStartTime(event.currentTarget.value)}
            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <p className="text-xs text-gray-500">
            Set a start time for the challenge.
          </p>
        </div>

        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg shadow-md w-64">
          <label className="text-sm font-medium text-gray-700">
            Testing end time
          </label>
          <TimeInput
            value={testEndTime}
            onChange={(event) => setTestEndTime(event.currentTarget.value)}
            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <p className="text-xs text-gray-500">
            Set an end time for the challenge.
          </p>
        </div>
      </Group>

      <Text
        className={`${overlaps ? "!text-red-500" : "!text-green-500"} !text-sm`}
      >
        {overlaps ? "The test time overlaps" : "The test time doen't overlap"}
      </Text>
    </Stack>
  );
};
