// Event data types
export interface EventData {
  name: string;
  startTime: string;
  endTime: string;
  week: string;
  quarter: string;
  location: string;
  description: string;
  special: string;
}

// Parse master CSV text and return array of events
function parseMasterCSV(csvText: string): EventData[] {
  const lines = csvText.trim().split('\n');
  const headerLine = lines.shift();
  if (!headerLine) return [];

  const header = headerLine.split(',').map(h => h.trim());
  const nameIndex = header.indexOf('Name');
  const startTimeIndex = header.indexOf('Start Time');
  const endTimeIndex = header.indexOf('End Time');
  const weekIndex = header.indexOf('Week');
  const quarterIndex = header.indexOf('Quarter');
  const locationIndex = header.indexOf('Location');
  const descriptionIndex = header.indexOf('Description');
  const specialIndex = header.indexOf('Special');


  const events: EventData[] = lines
    .map(line => {
      if (!line.trim()) return null;
      const values = line.split(',');
      return {
        name: values[nameIndex]?.trim() || '',
        startTime: values[startTimeIndex]?.trim() || '',
        endTime: values[endTimeIndex]?.trim() || '',
        week: values[weekIndex]?.trim() || '',
        quarter: values[quarterIndex]?.trim() || '',
        location: values[locationIndex]?.trim() || '',
        description: values[descriptionIndex]?.trim() || '',
        special: values[specialIndex]?.trim() || '',
      };
    })
    .filter((event): event is EventData => event !== null && !!event.name);

  return events;
}

// For static generation, use the raw CSV content
import masterListCsvContent from './events-master-list.csv?raw';

function slugify(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-');
}

// Load and parse all events, then group by quarter
export function getEventsByQuarterStatic(): Record<string, EventData[]> {
    const allEvents = parseMasterCSV(masterListCsvContent);
    const eventsByQuarter: Record<string, EventData[]> = {};

    for (const event of allEvents) {
        if (event.quarter) {
            const quarterSlug = slugify(event.quarter);
            if (!eventsByQuarter[quarterSlug]) {
                eventsByQuarter[quarterSlug] = [];
            }
            eventsByQuarter[quarterSlug].push(event);
        }
    }

    return eventsByQuarter;
}
