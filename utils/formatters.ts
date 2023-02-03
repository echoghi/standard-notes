export const formatDate = (date: Date | string = new Date()) => {
  // check if date is a valid date object
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    date = new Date(date);
  }

  // format date in this format 'Friday, Jan 01, 2021 02:00 AM'
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

export const formatTitleDate = (date = new Date()) => date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

export const formatNumberWithCommas = (number: number) => {
  if (!number) return '0';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getReadTime = (text: string) => {
  if (!text) return 'N/A';
  // Set the reading speed (in words per minute)
  const READING_SPEED = 200;

  // Split the text into an array of words
  const words = text.split(' ');

  // Calculate the total number of words
  const totalWords = words.length;

  // Calculate the estimated read time (in minutes)
  const readTime = totalWords / READING_SPEED;

  // Round the read time to the nearest half minute
  const roundedReadTime = Math.round(readTime * 2) / 2;

  // Check if the read time is less than one minute
  if (roundedReadTime < 1) {
    // Output "< 1 minute" if the read time is less than one minute
    return '< 1 minute';
  }

  // Output the rounded read time otherwise
  return `${roundedReadTime} minutes`;
};

export const getNoteStats = (text: string) => {
  if (!text) return '0 words · 0 characters · 0 paragraphs';
  // Split the text into an array of words
  const words = text.split(' ');

  // Calculate the total number of words
  const totalWords = formatNumberWithCommas(words.length);

  // Calculate the total number of characters
  const totalCharacters = formatNumberWithCommas(text.length);

  // Split the text into an array of paragraphs
  const paragraphs = text.split(/[\r\n]+/g);

  // Calculate the total number of paragraphs
  const totalParagraphs = formatNumberWithCommas(paragraphs.length);

  // Return the character statistics in the specified format
  return `${totalWords} words · ${totalCharacters} characters · ${totalParagraphs} paragraphs`;
};
