const fs = require('fs');
const path = require('path');

const MALE_FIRST_NAMES = [
  'Amit', 'Rahul', 'Abhishek', 'Rajesh', 'Suresh', 'Ramesh', 'Priyesh', 'Aditya', 'Rohan', 'Saurav',
  'Manish', 'Vikram', 'Ajay', 'Gaurav', 'Sandeep', 'Deepak', 'Sunil', 'Anil', 'Varun', 'Rohit',
  'Nitin', 'Akash', 'Vivek', 'Ankit', 'Siddharth', 'Kunal', 'Kartik', 'Divyansh', 'Arjun', 'Harish',
  'Manoj', 'Sanjay', 'Vijay', 'Pranav', 'Rishabh', 'Yash', 'Tushar', 'Sameer', 'Alok', 'Nikhil',
  'Sumit', 'Mayank', 'Tarun', 'Puneet', 'Chirag', 'Aman', 'Ishan', 'Dev', 'Kabir', 'Shreyas'
];

const FEMALE_FIRST_NAMES = [
  'Priya', 'Neha', 'Ritu', 'Anjali', 'Pooja', 'Sunita', 'Geeta', 'Babita', 'Kavita', 'Shweta',
  'Aarti', 'Divya', 'Sneha', 'Priyanka', 'Deepa', 'Meena', 'Rashmi', 'Jyoti', 'Swati', 'Preeti',
  'Nisha', 'Kiran', 'Mansi', 'Riya', 'Sakshi', 'Ishita', 'Tanvi', 'Shreya', 'Aishwarya', 'Aditi',
  'Shruti', 'Payal', 'Komal', 'Nidhi', 'Kajal', 'Radhika', 'Meghna', 'Richa', 'Pallavi', 'Sonali',
  'Shivani', 'Nehal', 'Pragya', 'Aaradhya', 'Avani', 'Diya', 'Ishika', 'Tanushree', 'Kavya', 'Kriti'
];

const SURNAMES = [
  'Sharma', 'Patel', 'Iyer', 'Gupta', 'Sen', 'Mehta', 'Nair', 'Rao', 'Joshi', 'Singh',
  'Reddy', 'Banerjee', 'Deshmukh', 'Kulkarni', 'Chawla', 'Malhotra', 'Kapoor', 'Das', 'Roy', 'Mishra',
  'Verma', 'Prasad', 'Choudhury', 'Bhatt', 'Bhatia', 'Saxena', 'Dubey', 'Tripathi', 'Gowda', 'Pillai',
  'Hegde', 'Menon', 'Bose', 'Mukhopadhyay', 'Patil', 'Jadhav', 'Shinde', 'More', 'Agarwal', 'Johar'
];

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist'];

const CASTES = {
  'Hindu': ['Brahmin', 'Kshatriya', 'Vaishya', 'Kayastha', 'Maratha', 'Rajput', 'Patel', 'Baniya', 'Jat'],
  'Sikh': ['Jat Sikh', 'Khatri', 'Arora', 'Ramgarhia'],
  'Jain': ['Oswal', 'Agarwal', 'Khandelwal', 'Porwal'],
  'Muslim': ['Sunni', 'Shia', 'Pathan', 'Sayyid'],
  'Christian': ['Roman Catholic', 'Protestant', 'Orthodox'],
  'Buddhist': ['Neo-Buddhist', 'Theravada']
};

const TECH_COMPANIES = ['Google', 'Microsoft', 'Meta', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Flipkart', 'Zomato'];
const TECH_DESIGNATIONS = ['Software Engineer', 'Senior Software Engineer', 'Technical Lead', 'Product Manager', 'Data Scientist', 'UX Designer', 'Solution Architect'];

const FINANCE_COMPANIES = ['Goldman Sachs', 'HDFC Bank', 'ICICI Bank', 'JP Morgan', 'Deloitte', 'EY', 'KPMG', 'PwC'];
const FINANCE_DESIGNATIONS = ['Investment Analyst', 'Financial Analyst', 'Consultant', 'Audit Manager', 'Relationship Manager', 'Portfolio Manager'];

const OTHER_COMPANIES = ['Apollo Hospitals', 'Teach for India', 'Reliance Industries', 'Tata Motors', 'L&T', 'Maruti Suzuki', 'Godrej', 'ITC'];
const OTHER_DESIGNATIONS = ['Operations Manager', 'HR Specialist', 'Business Development Executive', 'Marketing Manager', 'Content Lead', 'Project Manager', 'Brand Manager'];

const CORE_VALUES = [
  'Family-oriented', 'Career-focused', 'Traditional', 'Liberal', 'Spiritual',
  'Adventurous', 'Simple Living', 'Intellectual', 'Fitness Enthusiast', 'Artistic'
];

const MARITAL_STATUSES = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
const STATUS_TAGS = ['Active', 'Pending Match', 'Matched', 'On Hold'];

function toHeightStr(cm) {
  const inches = Math.round(cm / 2.54);
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSubset(arr, size) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
}

function generateProfiles() {
  const profiles = [];

  // Generate 50 Males
  for (let i = 0; i < 50; i++) {
    const firstName = MALE_FIRST_NAMES[i];
    const lastName = getRandomElement(SURNAMES);
    const age = getRandomInt(25, 38);
    const height = getRandomInt(165, 192); // in cm
    const income = getRandomInt(8, 60); // LPA
    
    // Profession details
    const category = getRandomElement(['tech', 'finance', 'other']);
    let company, designation;
    if (category === 'tech') {
      company = getRandomElement(TECH_COMPANIES);
      designation = getRandomElement(TECH_DESIGNATIONS);
    } else if (category === 'finance') {
      company = getRandomElement(FINANCE_COMPANIES);
      designation = getRandomElement(FINANCE_DESIGNATIONS);
    } else {
      company = getRandomElement(OTHER_COMPANIES);
      designation = getRandomElement(OTHER_DESIGNATIONS);
    }

    const religion = getRandomElement(RELIGIONS);
    const casteList = CASTES[religion] || ['Open'];
    const caste = getRandomElement(casteList);

    const maritalStatus = Math.random() < 0.8 ? 'Never Married' : getRandomElement(MARITAL_STATUSES.slice(1));
    const kids = maritalStatus === 'Never Married' ? 'No' : getRandomElement(['Yes', 'No', 'Maybe']);
    const relocate = getRandomElement(['Yes', 'No', 'Maybe']);
    const pets = getRandomElement(['Yes', 'No', 'Maybe']);
    const dietaryPreference = getRandomElement(['Veg', 'Non-Veg', 'Eggetarian']);
    const manglikStatus = getRandomElement(['No', 'Yes', 'Anshik']);
    const values = getRandomSubset(CORE_VALUES, getRandomInt(2, 4));
    const status = getRandomElement(STATUS_TAGS);

    profiles.push({
      id: `M-${100 + i}`,
      name: `${firstName} ${lastName}`,
      gender: 'Male',
      age,
      city: getRandomElement(CITIES),
      maritalStatus,
      height,
      heightStr: toHeightStr(height),
      income,
      incomeStr: `${income} LPA`,
      company,
      designation,
      religion,
      caste,
      kids,
      relocate,
      pets,
      dietaryPreference,
      manglikStatus,
      coreValues: values,
      status
    });
  }

  // Generate 50 Females
  for (let i = 0; i < 50; i++) {
    const firstName = FEMALE_FIRST_NAMES[i];
    const lastName = getRandomElement(SURNAMES);
    const age = getRandomInt(22, 35);
    const height = getRandomInt(150, 175); // in cm
    const income = getRandomInt(6, 45); // LPA

    // Profession details
    const category = getRandomElement(['tech', 'finance', 'other']);
    let company, designation;
    if (category === 'tech') {
      company = getRandomElement(TECH_COMPANIES);
      designation = getRandomElement(TECH_DESIGNATIONS);
    } else if (category === 'finance') {
      company = getRandomElement(FINANCE_COMPANIES);
      designation = getRandomElement(FINANCE_DESIGNATIONS);
    } else {
      company = getRandomElement(OTHER_COMPANIES);
      designation = getRandomElement(OTHER_DESIGNATIONS);
    }

    const religion = getRandomElement(RELIGIONS);
    const casteList = CASTES[religion] || ['Open'];
    const caste = getRandomElement(casteList);

    const maritalStatus = Math.random() < 0.85 ? 'Never Married' : getRandomElement(MARITAL_STATUSES.slice(1));
    const kids = maritalStatus === 'Never Married' ? 'No' : getRandomElement(['Yes', 'No', 'Maybe']);
    const relocate = getRandomElement(['Yes', 'No', 'Maybe']);
    const pets = getRandomElement(['Yes', 'No', 'Maybe']);
    const dietaryPreference = getRandomElement(['Veg', 'Non-Veg', 'Eggetarian']);
    const manglikStatus = getRandomElement(['No', 'Yes', 'Anshik']);
    const values = getRandomSubset(CORE_VALUES, getRandomInt(2, 4));
    const status = getRandomElement(STATUS_TAGS);

    profiles.push({
      id: `F-${100 + i}`,
      name: `${firstName} ${lastName}`,
      gender: 'Female',
      age,
      city: getRandomElement(CITIES),
      maritalStatus,
      height,
      heightStr: toHeightStr(height),
      income,
      incomeStr: `${income} LPA`,
      company,
      designation,
      religion,
      caste,
      kids,
      relocate,
      pets,
      dietaryPreference,
      manglikStatus,
      coreValues: values,
      status
    });
  }

  // Shuffle profiles
  const shuffledProfiles = profiles.sort(() => 0.5 - Math.random());

  const outputPath = path.join(__dirname, 'profiles.json');
  fs.writeFileSync(outputPath, JSON.stringify(shuffledProfiles, null, 2), 'utf-8');
  console.log(`Generated 100 profiles and saved to ${outputPath}`);
}

generateProfiles();
