const YEAR = new Date().getFullYear();

export const HOLIDAYS = [
  // Global Fixed Holidays
  { name: "🎄 Christmas Day", country: "World", date: `${YEAR}-12-25` },
  { name: "🎆 New Year's Day", country: "World", date: `${YEAR + 1}-01-01` },

  // Philippines
  { name: "Philippine Independence Day", country: "Philippines", date: `${YEAR}-06-12` },
  { name: "Bonifacio Day", country: "Philippines", date: `${YEAR}-11-30` },
  { name: "National Heroes Day (Last Mon of Aug)", country: "Philippines", date: `${YEAR}-08-25` },
  { name: "All Saints' Day", country: "Philippines", date: `${YEAR}-11-01` },

  // Japan
  { name: "New Year's Day", country: "Japan", date: `${YEAR}-01-01` },
  { name: "Coming of Age Day (2nd Mon of Jan)", country: "Japan", date: `${YEAR}-01-13` },
  { name: "National Foundation Day", country: "Japan", date: `${YEAR}-02-11` },
  { name: "Emperor's Birthday", country: "Japan", date: `${YEAR}-02-23` },
  { name: "Showa Day", country: "Japan", date: `${YEAR}-04-29` },
  { name: "Constitution Day", country: "Japan", date: `${YEAR}-05-03` },
  { name: "Greenery Day", country: "Japan", date: `${YEAR}-05-04` },
  { name: "Children's Day", country: "Japan", date: `${YEAR}-05-05` },
  { name: "Marine Day (3rd Mon of Jul)", country: "Japan", date: `${YEAR}-07-21` },
  { name: "Mountain Day", country: "Japan", date: `${YEAR}-08-11` },
  { name: "Respect for the Aged Day (3rd Mon of Sep)", country: "Japan", date: `${YEAR}-09-15` },
  { name: "Health and Sports Day (2nd Mon of Oct)", country: "Japan", date: `${YEAR}-10-13` },
  { name: "Culture Day", country: "Japan", date: `${YEAR}-11-03` },
  { name: "Labor Thanksgiving Day", country: "Japan", date: `${YEAR}-11-23` },

  // China
  { name: "New Year's Day", country: "China", date: `${YEAR}-01-01` },
  { name: "Labor Day", country: "China", date: `${YEAR}-05-01` },
  { name: "National Day", country: "China", date: `${YEAR}-10-01` },
  { name: "National Day Holiday", country: "China", date: `${YEAR}-10-02` },
  { name: "National Day Holiday", country: "China", date: `${YEAR}-10-03` },

  // South Korea
  { name: "Independence Movement Day", country: "South Korea", date: `${YEAR}-03-01` },
  { name: "Children's Day", country: "South Korea", date: `${YEAR}-05-05` },
  { name: "Memorial Day", country: "South Korea", date: `${YEAR}-06-06` },
  { name: "Liberation Day", country: "South Korea", date: `${YEAR}-08-15` },
  { name: "National Foundation Day", country: "South Korea", date: `${YEAR}-10-03` },
  { name: "Hangul Day", country: "South Korea", date: `${YEAR}-10-09` },

  // India
  { name: "Republic Day", country: "India", date: `${YEAR}-01-26` },
  { name: "Independence Day", country: "India", date: `${YEAR}-08-15` },
  { name: "Gandhi Jayanti", country: "India", date: `${YEAR}-10-02` },

  // UAE
  { name: "New Year's Day", country: "UAE", date: `${YEAR}-01-01` },
  { name: "Commemoration Day", country: "UAE", date: `${YEAR}-12-01` },
  { name: "National Day", country: "UAE", date: `${YEAR}-12-02` },

  // United Kingdom
  { name: "New Year's Day", country: "United Kingdom", date: `${YEAR}-01-01` },
  { name: "Early May Bank Holiday", country: "United Kingdom", date: `${YEAR}-05-05` },
  { name: "Spring Bank Holiday", country: "United Kingdom", date: `${YEAR}-05-26` },
  { name: "Summer Bank Holiday", country: "United Kingdom", date: `${YEAR}-08-25` },
  { name: "Christmas Day", country: "United Kingdom", date: `${YEAR}-12-25` },
  { name: "Boxing Day", country: "United Kingdom", date: `${YEAR}-12-26` },

  // Germany
  { name: "New Year's Day", country: "Germany", date: `${YEAR}-01-01` },
  { name: "Labour Day", country: "Germany", date: `${YEAR}-05-01` },
  { name: "German Unity Day", country: "Germany", date: `${YEAR}-10-03` },
  { name: "Christmas Day", country: "Germany", date: `${YEAR}-12-25` },
  { name: "St. Stephen's Day", country: "Germany", date: `${YEAR}-12-26` },

  // France
  { name: "New Year's Day", country: "France", date: `${YEAR}-01-01` },
  { name: "Labour Day", country: "France", date: `${YEAR}-05-01` },
  { name: "Victory in Europe Day", country: "France", date: `${YEAR}-05-08` },
  { name: "Bastille Day", country: "France", date: `${YEAR}-07-14` },
  { name: "Assumption of Mary", country: "France", date: `${YEAR}-08-15` },
  { name: "All Saints' Day", country: "France", date: `${YEAR}-11-01` },
  { name: "Armistice Day", country: "France", date: `${YEAR}-11-11` },
  { name: "Christmas Day", country: "France", date: `${YEAR}-12-25` },

  // Russia
  { name: "New Year's Day", country: "Russia", date: `${YEAR}-01-01` },
  { name: "New Year Holiday", country: "Russia", date: `${YEAR}-01-02` },
  { name: "New Year Holiday", country: "Russia", date: `${YEAR}-01-03` },
  { name: "New Year Holiday", country: "Russia", date: `${YEAR}-01-04` },
  { name: "New Year Holiday", country: "Russia", date: `${YEAR}-01-05` },
  { name: "New Year Holiday", country: "Russia", date: `${YEAR}-01-06` },
  { name: "Orthodox Christmas", country: "Russia", date: `${YEAR}-01-07` },
  { name: "Defender of the Fatherland Day", country: "Russia", date: `${YEAR}-02-23` },
  { name: "International Women's Day", country: "Russia", date: `${YEAR}-03-08` },
  { name: "Spring and Labour Day", country: "Russia", date: `${YEAR}-05-01` },
  { name: "Victory Day", country: "Russia", date: `${YEAR}-05-09` },
  { name: "Russia Day", country: "Russia", date: `${YEAR}-06-12` },
  { name: "Unity Day", country: "Russia", date: `${YEAR}-11-04` },

  // USA
  { name: "New Year's Day", country: "USA", date: `${YEAR}-01-01` },
  { name: "Martin Luther King Jr. Day (3rd Mon of Jan)", country: "USA", date: `${YEAR}-01-20` },
  { name: "Presidents' Day (3rd Mon of Feb)", country: "USA", date: `${YEAR}-02-17` },
  { name: "Memorial Day (Last Mon of May)", country: "USA", date: `${YEAR}-05-26` },
  { name: "Juneteenth", country: "USA", date: `${YEAR}-06-19` },
  { name: "Independence Day", country: "USA", date: `${YEAR}-07-04` },
  { name: "Labor Day (1st Mon of Sep)", country: "USA", date: `${YEAR}-09-01` },
  { name: "Columbus Day (2nd Mon of Oct)", country: "USA", date: `${YEAR}-10-13` },
  { name: "Veterans Day", country: "USA", date: `${YEAR}-11-11` },
  { name: "Thanksgiving Day (4th Thu of Nov)", country: "USA", date: `${YEAR}-11-27` },
  { name: "Christmas Day", country: "USA", date: `${YEAR}-12-25` },

  // Canada
  { name: "New Year's Day", country: "Canada", date: `${YEAR}-01-01` },
  { name: "Family Day (3rd Mon of Feb)", country: "Canada", date: `${YEAR}-02-17` },
  { name: "Victoria Day (Mon before May 25)", country: "Canada", date: `${YEAR}-05-19` },
  { name: "Canada Day", country: "Canada", date: `${YEAR}-07-01` },
  { name: "Civic Holiday (1st Mon of Aug)", country: "Canada", date: `${YEAR}-08-04` },
  { name: "Labour Day (1st Mon of Sep)", country: "Canada", date: `${YEAR}-09-01` },
  { name: "Thanksgiving (2nd Mon of Oct)", country: "Canada", date: `${YEAR}-10-13` },
  { name: "Remembrance Day", country: "Canada", date: `${YEAR}-11-11` },
  { name: "Christmas Day", country: "Canada", date: `${YEAR}-12-25` },
  { name: "Boxing Day", country: "Canada", date: `${YEAR}-12-26` },

  // Brazil
  { name: "New Year's Day", country: "Brazil", date: `${YEAR}-01-01` },
  { name: "Tiradentes Day", country: "Brazil", date: `${YEAR}-04-21` },
  { name: "Labour Day", country: "Brazil", date: `${YEAR}-05-01` },
  { name: "Independence Day", country: "Brazil", date: `${YEAR}-09-07` },
  { name: "Our Lady of Aparecida", country: "Brazil", date: `${YEAR}-10-12` },
  { name: "All Souls' Day", country: "Brazil", date: `${YEAR}-11-02` },
  { name: "Republic Proclamation Day", country: "Brazil", date: `${YEAR}-11-15` },
  { name: "Christmas Day", country: "Brazil", date: `${YEAR}-12-25` },

  // Mexico
  { name: "New Year's Day", country: "Mexico", date: `${YEAR}-01-01` },
  { name: "Constitution Day (1st Mon of Feb)", country: "Mexico", date: `${YEAR}-02-03` },
  { name: "Benito Juárez's Birthday (3rd Mon of Mar)", country: "Mexico", date: `${YEAR}-03-17` },
  { name: "Labour Day", country: "Mexico", date: `${YEAR}-05-01` },
  { name: "Independence Day", country: "Mexico", date: `${YEAR}-09-16` },
  { name: "Revolution Day (3rd Mon of Nov)", country: "Mexico", date: `${YEAR}-11-17` },
  { name: "Christmas Day", country: "Mexico", date: `${YEAR}-12-25` },

  // Australia
  { name: "New Year's Day", country: "Australia", date: `${YEAR}-01-01` },
  { name: "Australia Day", country: "Australia", date: `${YEAR}-01-26` },
  { name: "ANZAC Day", country: "Australia", date: `${YEAR}-04-25` },
  { name: "Christmas Day", country: "Australia", date: `${YEAR}-12-25` },
  { name: "Boxing Day", country: "Australia", date: `${YEAR}-12-26` },

  // New Zealand
  { name: "New Year's Day", country: "New Zealand", date: `${YEAR}-01-01` },
  { name: "Day after New Year's Day", country: "New Zealand", date: `${YEAR}-01-02` },
  { name: "Waitangi Day", country: "New Zealand", date: `${YEAR}-02-06` },
  { name: "ANZAC Day", country: "New Zealand", date: `${YEAR}-04-25` },
  { name: "Christmas Day", country: "New Zealand", date: `${YEAR}-12-25` },
  { name: "Boxing Day", country: "New Zealand", date: `${YEAR}-12-26` },

  // Egypt
  { name: "New Year's Day", country: "Egypt", date: `${YEAR}-01-01` },
  { name: "Coptic Christmas", country: "Egypt", date: `${YEAR}-01-07` },
  { name: "Sinai Liberation Day", country: "Egypt", date: `${YEAR}-04-25` },
  { name: "Labour Day", country: "Egypt", date: `${YEAR}-05-01` },
  { name: "Revolution Day", country: "Egypt", date: `${YEAR}-07-23` },
  { name: "Armed Forces Day", country: "Egypt", date: `${YEAR}-10-06` },

  // South Africa
  { name: "New Year's Day", country: "South Africa", date: `${YEAR}-01-01` },
  { name: "Human Rights Day", country: "South Africa", date: `${YEAR}-03-21` },
  { name: "Freedom Day", country: "South Africa", date: `${YEAR}-04-27` },
  { name: "Workers' Day", country: "South Africa", date: `${YEAR}-05-01` },
  { name: "Youth Day", country: "South Africa", date: `${YEAR}-06-16` },
  { name: "National Women's Day", country: "South Africa", date: `${YEAR}-08-09` },
  { name: "Heritage Day", country: "South Africa", date: `${YEAR}-09-24` },
  { name: "Day of Reconciliation", country: "South Africa", date: `${YEAR}-12-16` },
  { name: "Christmas Day", country: "South Africa", date: `${YEAR}-12-25` },
  { name: "Day of Goodwill", country: "South Africa", date: `${YEAR}-12-26` },

  // Nigeria
  { name: "New Year's Day", country: "Nigeria", date: `${YEAR}-01-01` },
  { name: "Labour Day", country: "Nigeria", date: `${YEAR}-05-01` },
  { name: "Democracy Day", country: "Nigeria", date: `${YEAR}-06-12` },
  { name: "Independence Day", country: "Nigeria", date: `${YEAR}-10-01` },
  { name: "Christmas Day", country: "Nigeria", date: `${YEAR}-12-25` },
  { name: "Boxing Day", country: "Nigeria", date: `${YEAR}-12-26` },

  // Kenya
  { name: "New Year's Day", country: "Kenya", date: `${YEAR}-01-01` },
  { name: "Labour Day", country: "Kenya", date: `${YEAR}-05-01` },
  { name: "Madaraka Day", country: "Kenya", date: `${YEAR}-06-01` },
  { name: "Mashujaa Day", country: "Kenya", date: `${YEAR}-10-20` },
  { name: "Jamhuri Day", country: "Kenya", date: `${YEAR}-12-12` },
  { name: "Christmas Day", country: "Kenya", date: `${YEAR}-12-25` },
  { name: "Boxing Day", country: "Kenya", date: `${YEAR}-12-26` },
];
