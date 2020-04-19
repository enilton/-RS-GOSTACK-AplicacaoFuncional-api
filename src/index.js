const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const cors = required('cors');

const app = express();
app.use(cors());
app.use(express.json());

const projects = [];

function logRequests(req, res, next) {
    const { method, url } = req;
    const logLabel = `[${method.toUpperCase()}] ${url}`;
    console.log(logLabel);
    return next();
}

function logTimeRequests(req, res, next) {
    const { method, url } = req;
    const logLabel = `[${method.toUpperCase()}] ${url}`;
    console.time(logLabel);
    next();
    console.timeEnd(logLabel);
}

function validateProjectId(req, res, next) {
    const { id } = req.params;
    if (!isUuid(id)){
        return res.status(400).json({ error: 'invalid project id'});
    }
    return next();
}

app.use(logRequests, logTimeRequests);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (req, res) => {
    const { title } = req.query;

    const results = title 
        ? projects.filter(project => project.title.includes(title))
        : projects;
    
    return res.json(results);
});

app.post('/projects', (req, res) => {
    const { title, owner } = req.body;
    const project = { id: uuid(), title, owner };
    projects.push(project);
    return res.json(project);
});

app.put('/projects/:id', (req,res) => {
    const { id } = req.params;
    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return res.status(400).json({ error: 'project not found'});
    }
    const { title, owner } = req.body;

    const project = {
        id,
        title,
        owner
    };

    projects[projectIndex] = project;
    return res.json(project);
});

app.delete('/projects/:id', (req, res) => {
    const { id } = req.params;    
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex < 0) {
        return res.status(400).json({ error: 'project not found'});
    }

    projects.splice(projectIndex,1);
    return res.status(204).send();
});

app.listen(3333);



