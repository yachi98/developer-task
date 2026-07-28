import { it, expect } from "vitest";
import { parseUkri, parseMpd } from "./parseCSV";

const MPD_CSV = `Section #,Station (m),MPD (mm),Latitude,Longitude
1,0.0 to 10.0,1.49,51.5 N,0.25 W`;

const UKRI_CSV = `Track, Segment, Start (m), End (m), UKRI (m/km), GPS
1,2,0.0,10.0,1.25,51.5 N 0.25 W`;

// Give the parser the MPD text and check the data row: the "0.0 to 10.0" range
// is split into start/end, `chainage` is their midpoint, and latitude/longitude
// come from their own columns.
it("parseMpd turns a CSV row into a reading object", () => {
  const rows = parseMpd(MPD_CSV);
  expect(rows).toHaveLength(1);
  expect(rows[0]).toEqual({
    id: "MPD-0", // first data row -> `${metric}-${index}`
    metric: "MPD",
    section: 1,
    start: 0,
    end: 10,
    chainage: 5,
    value: 1.49,
    latitude: 51.5,
    longitude: -0.25,
  });
});

// Give the parser the CSV text and check it turns the data row into the right
// object: the header is skipped, each column maps to a field, `chainage` is the
// midpoint of start/end, and "51.5 N 0.25 W" becomes a signed lat/lon.
it("parseUkri turns a CSV row into a reading object", () => {
  const rows = parseUkri(UKRI_CSV);
  expect(rows).toHaveLength(1);
  expect(rows[0]).toEqual({
    id: "UKRI-0", // first data row -> `${metric}-${index}`
    metric: "UKRI",
    section: 2,
    start: 0,
    end: 10,
    chainage: 5,
    value: 1.25,
    latitude: 51.5,
    longitude: -0.25,
  });
});
