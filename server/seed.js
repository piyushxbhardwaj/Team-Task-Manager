const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@taskflow.com',
      password: 'admin123',
      role: 'Admin',
    });

    // Create Member
    const member = await User.create({
      name: 'Member User',
      email: 'member@taskflow.com',
      password: 'member123',
      role: 'Member',
    });

    // Create Project
    const project = await Project.create({
      name: 'E-commerce Platform',
      description: 'Building a next-gen e-commerce platform with React and Node.js.',
      owner: admin._id,
      members: [member._id],
    });

    // Create Tasks
    await Task.create([
      {
        title: 'Design Database Schema',
        description: 'Create initial ERD and implement in MongoDB.',
        status: 'Completed',
        priority: 'High',
        assignedTo: admin._id,
        projectId: project._id,
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Overdue but completed
      },
      {
        title: 'Implement Auth Flow',
        description: 'Setup JWT and protected routes.',
        status: 'In Progress',
        priority: 'High',
        assignedTo: member._id,
        projectId: project._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Fix Navigation Bug',
        description: 'Menu is not closing on mobile.',
        status: 'Todo',
        priority: 'Medium',
        assignedTo: member._id,
        projectId: project._id,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // OVERDUE
      },
    ]);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
