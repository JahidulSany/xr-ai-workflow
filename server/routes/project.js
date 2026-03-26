const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const { authMiddleware } = require('../utils/auth');
const { Project, User } = require('../models/index');
const { buildPrompt } = require('../services/promptBuilder');
const { chatgpt } = require('../services/chatgpt');
const { writeRecommendationPdf } = require('../services/generateReportPdf');

const UPLOAD_DIR = path.join(__dirname, '../uploads/reports');

function ensureUploadDir() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function mapBodyName(body) {
  const raw = body.name ?? body.projectName;
  return raw && String(raw).trim() ? String(raw).trim() : null;
}

function normalizeSelections(body) {
  if (Array.isArray(body.selections) && body.selections.length > 0) {
    return body.selections.filter(Boolean);
  }

  return [
    {
      key: 'xr-type',
      title: body.xrType,
      description: body.xrType || '',
      image: '',
    },
    {
      key: 'object-creation',
      title: body.objectMethod,
      description: body.objectMethod || '',
      image: '',
    },
    {
      key: 'environment-creation',
      title: body.environmentMethod,
      description: body.environmentMethod || '',
      image: '',
    },
    {
      key: 'platform-creation',
      title: body.platform,
      description: body.platform || '',
      image: '',
    },
  ].filter((item) => item.title);
}

async function createStructuredRecommendation(projectData) {
  const prompt = buildPrompt(projectData);
  const message = await chatgpt(prompt);

  if (!message?.content) {
    throw new Error('ChatGPT returned an empty response');
  }

  try {
    return JSON.parse(message.content);
  } catch (error) {
    console.error('Failed to parse ChatGPT JSON:', message.content);
    throw new Error('ChatGPT returned invalid JSON');
  }
}

router.post('/recommendation', authMiddleware, async (req, res) => {
  try {
    ensureUploadDir();

    const {
      name,
      projectName,
      xrType,
      objectMethod,
      environmentMethod,
      platform,
    } = req.body;

    if (!xrType || !objectMethod || !environmentMethod || !platform) {
      return res.status(400).json({
        error:
          'Missing required fields: xrType, objectMethod, environmentMethod, platform',
      });
    }

    const selections = normalizeSelections(req.body);
    const userId = req.user.id;
    const projectTitle =
      mapBodyName({ name, projectName }) ||
      `XR project ${new Date().toISOString().slice(0, 10)}`;

    const project = await Project.create({
      userId,
      name: projectTitle,
      xrType,
      objectMethod,
      environmentMethod,
      platform,
      filename: null,
    });

    const filename = `${userId}-${project.id}.pdf`;
    const absolutePath = path.join(UPLOAD_DIR, filename);

    const structured = await createStructuredRecommendation({
      xrType,
      objectMethod,
      environmentMethod,
      platform,
      selections,
    });

    await writeRecommendationPdf({
      outputPath: absolutePath,
      structured,
      meta: {
        userId,
        projectId: project.id,
        selections,
      },
    });

    await project.update({ filename });
    await project.reload();

    res.status(201).json({
      project: project.toJSON(),
      recommendation: structured,
      filename,
      downloadUrl: `/api/projects/${project.id}/pdf`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || 'Recommendation failed',
    });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const title = mapBodyName(req.body);
    const { xrType, objectMethod, environmentMethod, platform } = req.body;

    if (!title || !xrType || !objectMethod || !environmentMethod || !platform) {
      return res.status(400).json({
        error:
          'Missing required fields: name or projectName, xrType, objectMethod, environmentMethod, platform',
      });
    }

    const post = await Project.create({
      name: title,
      xrType,
      objectMethod,
      environmentMethod,
      platform,
      userId: req.user.id,
      filename: null,
    });

    res.status(201).json({ project: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding Project' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving Projects' });
  }
});

router.get('/:id/pdf', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project || project.userId !== req.user.id) {
      return res.status(404).json({ message: 'Not found' });
    }
    if (!project.filename) {
      return res.status(404).json({ message: 'Report not ready' });
    }
    const filePath = path.join(UPLOAD_DIR, project.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File missing' });
    }
    res.download(filePath, project.filename);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Download failed' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const row = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
      ],
    });
    if (!row || row.userId !== req.user.id) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(row);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving project' });
  }
});

module.exports = router;