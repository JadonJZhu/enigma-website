// Event data types
export interface EventData {
  date: string;
  event: string;
}

// Parse CSV text and return array of events
function parseCSV(csvText: string): EventData[] {
  const lines = csvText.trim().split('\n');

  // Find the header row (contains "Date" and "Event")
  const headerIndex = lines.findIndex(line =>
    line.includes('Date') && line.includes('Event')
  );

  if (headerIndex === -1) {
    throw new Error('Could not find header row with Date and Event columns');
  }

  const events: EventData[] = [];

  // Parse data rows after header
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    // Split by comma and clean up
    const columns = line.split(',').map(col => col.trim().replace(/^["']|["']$/g, ''));

    // Skip if not enough columns or if it's a header-like row
    if (columns.length < 4 || columns[1] === 'Date') continue;

    const date = columns[1];
    const event = columns[3];

    // Only include gaming-related events
    
      events.push({ date, event });
  }

  return events;
}

// Load and parse the summer 2025 events
export async function loadSummer2025Events(): Promise<EventData[]> {
  try {
    const response = await fetch('/data/summer-2025-events.csv');
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
}

// For static generation, we'll use the raw CSV content
import summerCsvContent from './summer-2025-game-nights.csv?raw';
import fallCsvContent from './fall-2025-game-nights.csv?raw';

export function getSummer2025EventsStatic(): EventData[] {
  return parseCSV(summerCsvContent);
}

export function getFall2025EventsStatic(): EventData[] {
  return parseCSV(fallCsvContent);
}

// Helper function to format date for display
export function formatEventDate(dateStr: string): { date: string; month: string; year: string } {
  try {
    const [month, day] = dateStr.split('/');
    const date = new Date(2025, parseInt(month) - 1, parseInt(day));

    return {
      date: day,
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: '2025'
    };
  } catch (error) {
    return { date: dateStr, month: '', year: '2025' };
  }
}
