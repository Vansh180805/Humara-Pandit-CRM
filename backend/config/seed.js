const User = require('../models/User');
const Client = require('../models/Client');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');

const seedDB = async () => {
  try {
    // Check if database is already seeded
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has user profiles. Skipping seed.');
      return;
    }

    console.log('Database empty. Commencing automatic mock data seeding...');

    // 1. Seed Demo Users
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@demo.com',
      password: 'Admin@123',
      role: 'admin'
    });

    const astrologer = await User.create({
      name: 'Pandit Shastri',
      email: 'astrologer@demo.com',
      password: 'Astro@123',
      role: 'astrologer'
    });

    // 2. Seed Mock Clients (12 clients)
    const clientData = [
      { name: 'Vansh Kaushik', phone: '9876543210', email: 'vansh@gmail.com', dob: new Date('2004-05-12'), tob: '10:30 AM', pob: 'Delhi', gender: 'Male', rashi: 'Kumbha (Aquarius)' },
      { name: 'Rahul Sharma', phone: '9812345678', email: 'rahul@gmail.com', dob: new Date('1998-03-24'), tob: '04:15 PM', pob: 'Jaipur', gender: 'Male', rashi: 'Meena (Pisces)' },
      { name: 'Priya Singh', phone: '9789012345', email: 'priya@gmail.com', dob: new Date('1995-11-05'), tob: '08:45 AM', pob: 'Varanasi', gender: 'Female', rashi: 'Vrishchika (Scorpio)' },
      { name: 'Amit Patel', phone: '9654321098', email: 'amit@gmail.com', dob: new Date('1990-07-18'), tob: '11:20 PM', pob: 'Ahmedabad', gender: 'Male', rashi: 'Karka (Cancer)' },
      { name: 'Sneha Gupta', phone: '9543210987', email: 'sneha@gmail.com', dob: new Date('2000-01-30'), tob: '02:05 AM', pob: 'Kolkata', gender: 'Female', rashi: 'Kumbha (Aquarius)' },
      { name: 'Vikram Aditya', phone: '9432109876', email: 'vikram@gmail.com', dob: new Date('1988-12-15'), tob: '06:50 PM', pob: 'Mumbai', gender: 'Male', rashi: 'Dhanu (Sagittarius)' },
      { name: 'Divya Iyer', phone: '9321098765', email: 'divya@gmail.com', dob: new Date('1993-09-02'), tob: '09:15 AM', pob: 'Chennai', gender: 'Female', rashi: 'Simha (Leo)' },
      { name: 'Rohan Mehta', phone: '9210987654', email: 'rohan@gmail.com', dob: new Date('1997-04-10'), tob: '01:30 PM', pob: 'Pune', gender: 'Male', rashi: 'Mesh (Aries)' },
      { name: 'Anjali Verma', phone: '9109876543', email: 'anjali@gmail.com', dob: new Date('1992-06-22'), tob: '05:40 AM', pob: 'Lucknow', gender: 'Female', rashi: 'Mithuna (Gemini)' },
      { name: 'Karan Malhotra', phone: '9098765432', email: 'karan@gmail.com', dob: new Date('1985-08-14'), tob: '10:05 PM', pob: 'Chandigarh', gender: 'Male', rashi: 'Simha (Leo)' },
      { name: 'Ritu Sen', phone: '9887654321', email: 'ritu@gmail.com', dob: new Date('1999-10-08'), tob: '12:12 PM', pob: 'Patna', gender: 'Female', rashi: 'Kanya (Virgo)' },
      { name: 'Sanjay Dutt', phone: '9776543210', email: 'sanjay@gmail.com', dob: new Date('1982-02-17'), tob: '07:25 AM', pob: 'Bhopal', gender: 'Male', rashi: 'Kumbha (Aquarius)' }
    ];

    const clients = await Client.create(clientData);

    // 3. Seed Mock Appointments (6 Scheduled, 4 Completed, 2 Cancelled)
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date(today); lastWeek.setDate(today.getDate() - 7);

    const appointmentsData = [
      { clientId: clients[0]._id, date: tomorrow, time: '10:30 AM', status: 'Scheduled' },
      { clientId: clients[1]._id, date: tomorrow, time: '12:00 PM', status: 'Scheduled' },
      { clientId: clients[2]._id, date: dayAfter, time: '02:30 PM', status: 'Scheduled' },
      { clientId: clients[3]._id, date: dayAfter, time: '04:00 PM', status: 'Scheduled' },
      { clientId: clients[4]._id, date: tomorrow, time: '09:30 AM', status: 'Scheduled' },
      { clientId: clients[5]._id, date: dayAfter, time: '11:00 AM', status: 'Scheduled' },
      
      { clientId: clients[6]._id, date: yesterday, time: '10:00 AM', status: 'Completed' },
      { clientId: clients[7]._id, date: yesterday, time: '03:30 PM', status: 'Completed' },
      { clientId: clients[8]._id, date: lastWeek, time: '11:30 AM', status: 'Completed' },
      { clientId: clients[9]._id, date: lastWeek, time: '05:00 PM', status: 'Completed' },

      { clientId: clients[10]._id, date: yesterday, time: '11:00 AM', status: 'Cancelled' },
      { clientId: clients[11]._id, date: lastWeek, time: '02:00 PM', status: 'Cancelled' }
    ];

    await Appointment.create(appointmentsData);

    // 4. Seed Mock Consultations (8 consultations)
    // Some are completed, some have follow-up status 'Pending' or 'Completed'
    const followUpDate1 = new Date(today); followUpDate1.setDate(today.getDate() + 4); // June 15 or in 4 days
    const followUpDate2 = new Date(today); followUpDate2.setDate(today.getDate() + 10);
    const followUpDatePast = new Date(today); followUpDatePast.setDate(today.getDate() - 2);

    const consultationsData = [
      {
        clientId: clients[0]._id,
        date: yesterday,
        notes: 'Client worried about placement. Placements are delayed. Suggested focusing on technical skills and patience.',
        remedies: {
          gemstones: ['Yellow Sapphire'],
          rudrakshas: ['5-Mukhi Rudraksha Mala'],
          crystals: []
        },
        followUpDate: followUpDate1,
        followUpStatus: 'Pending'
      },
      {
        clientId: clients[1]._id,
        date: yesterday,
        notes: 'Discussion about marriage delay. Seventh house Saturn influence causing obstacles. Advised puja remedies.',
        remedies: {
          gemstones: ['Pearl'],
          rudrakshas: ['2 Mukhi Rudraksha'],
          crystals: []
        },
        followUpDate: followUpDate2,
        followUpStatus: 'Pending'
      },
      {
        clientId: clients[6]._id,
        date: yesterday,
        notes: 'Career progression consultation. Rahu mahadasha running. Recommended wearing crystal bracelet to channel energy.',
        remedies: {
          gemstones: [],
          rudrakshas: [],
          crystals: ['Clear Quartz']
        },
        followUpDate: followUpDate1,
        followUpStatus: 'Pending'
      },
      {
        clientId: clients[7]._id,
        date: yesterday,
        notes: 'Health issues discussed. Advised daily Surya Namaskar and Gemstone.',
        remedies: {
          gemstones: ['Ruby'],
          rudrakshas: [],
          crystals: []
        },
        followUpDate: followUpDate2,
        followUpStatus: 'Pending'
      },
      {
        clientId: clients[8]._id,
        date: lastWeek,
        notes: 'Business partnership query. Sun-Mercury placement is good. Partnership will be profitable.',
        remedies: {
          gemstones: ['Emerald'],
          rudrakshas: [],
          crystals: []
        },
        followUpDate: followUpDatePast,
        followUpStatus: 'Completed'
      },
      {
        clientId: clients[9]._id,
        date: lastWeek,
        notes: 'Property purchase timing query. Fourth house is strong. Advised buying after October.',
        remedies: {
          gemstones: [],
          rudrakshas: ['8 Mukhi Rudraksha'],
          crystals: ['Rose Quartz']
        },
        followUpDate: followUpDatePast,
        followUpStatus: 'Completed'
      },
      {
        clientId: clients[2]._id,
        date: lastWeek,
        notes: 'Horoscope general reading. Kundli charts indicate mild Shani sade sati phase. Remedy logged.',
        remedies: {
          gemstones: ['Blue Sapphire'],
          rudrakshas: [],
          crystals: ['Amethyst Crystal']
        },
        followUpDate: null,
        followUpStatus: 'None'
      },
      {
        clientId: clients[3]._id,
        date: lastWeek,
        notes: 'Relationship struggles. Combust Venus. Recommended Rose Quartz for bedroom.',
        remedies: {
          gemstones: [],
          rudrakshas: [],
          crystals: ['Rose Quartz']
        },
        followUpDate: null,
        followUpStatus: 'None'
      }
    ];

    await Consultation.create(consultationsData);

    console.log('Database successfully seeded with 2 users, 12 clients, 12 appointments, and 8 consultation logs!');
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};

module.exports = seedDB;
