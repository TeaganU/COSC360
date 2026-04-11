let RelativeTime;

describe("RelativeTime", () => {
  beforeAll(async () => {
    ({ RelativeTime } = await import("../../client/src/lib/RelativeTime.js"));
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-10T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("returns Recently for missing timestamps", () => {
    expect(RelativeTime()).toBe("Recently");
  });

  test("returns Recently for invalid timestamps", () => {
    expect(RelativeTime("not-a-date")).toBe("Recently");
  });

  test("formats minutes, hours, and days ago", () => {
    expect(RelativeTime("2026-04-10T11:59:00.000Z")).toBe("1 Minute Ago");
    expect(RelativeTime("2026-04-10T10:00:00.000Z")).toBe("2 Hours Ago");
    expect(RelativeTime("2026-04-07T12:00:00.000Z")).toBe("3 Days Ago");
  });
});
