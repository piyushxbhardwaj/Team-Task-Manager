const asyncHandler = require('../utils/asyncHandler');
const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  let projects;
  if (req.user.role === 'Admin') {
    projects = await Project.find({}).populate('owner', 'name email').populate('members', 'name email');
  } else {
    projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).populate('owner', 'name email').populate('members', 'name email');
  }
  res.json(projects);
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
  const { name, description, members } = req.body;

  const project = new Project({
    name,
    description,
    owner: req.user._id,
    members: members || [],
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('members', 'name email');

  if (project) {
    // Check if user is owner or member
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isMember = project.members.some((m) => m._id.toString() === req.user._id.toString());

    if (req.user.role === 'Admin' || isOwner || isMember) {
      res.json(project);
    } else {
      res.status(403);
      throw new Error('Not authorized to view this project');
    }
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, members } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    if (req.user.role === 'Admin' || project.owner.toString() === req.user._id.toString()) {
      project.name = name || project.name;
      project.description = description || project.description;
      project.members = members || project.members;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(403);
      throw new Error('Not authorized to update this project');
    }
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    if (req.user.role === 'Admin' || project.owner.toString() === req.user._id.toString()) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(403);
      throw new Error('Not authorized to delete this project');
    }
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
