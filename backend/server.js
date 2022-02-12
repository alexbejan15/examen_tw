const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cors = require('cors');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'jobs.db',
    define: {
        timestamps: false
    }
})


const JobPosting = sequelize.define('jobpostings', {
    id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { len: [3, 50] }
    },
    deadline: {
        type: Sequelize.DATE
    }
})

const Candidate = sequelize.define('candidates', {
    id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { len: [5, 50] }
    },
    cv: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { len: [100, 5000] }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
})

JobPosting.hasMany(Candidate);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/sync', async (req, res) => {
    try {
        await sequelize.sync({ force: true });
        res.status(201).json({ message: 'tables created' });
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'some error occured' })
    }
});

app.get('/jobpostings', async (req, res) => {
    const { simplified, sortBy, dir, deadline, description, page, pageSize } =
        req.query;
    const filters = {
        ...(deadline && { deadline }),
        ...(description && { description: { [Sequelize.Op.like]: `%${description}%` } }),
    };
    console.log(sortBy ? [sortBy, dir ?? 'ASC'] : undefined);
    try {
        const jobposting = await JobPosting.findAll({
            attributes: simplified ? { exclude: 'id' } : undefined,
            order: sortBy ? [[sortBy, dir ?? 'ASC']] : undefined,
            where: { ...filters },
            offset: page,
            limit: pageSize,
        });
        res.status(200).json(jobposting);
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'some error occured' });
    }
});

app.post('/jobpostings', async (req, res) => {
    try {
        await JobPosting.create(req.body);
        res.status(201).json({ message: 'created' })
    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'some error occured' })
    }
});

app.get('/jobpostings/:jid', async (req, res) => {
    try {
        const jobposting = await JobPosting.findByPk(req.params.jid, { include: Candidate });
        if (jobposting) {
            res.status(200).json(jobposting);
        } else {
            res.status(404).json({ message: 'not found' });
        }

    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'some error occured' })
    }
});

app.put('/jobpostings/:jid', async (req, res) => {
    try {
        const jobposting = await JobPosting.findByPk(req.params.jid);
        console.log(req.params.jid);
        console.log(req.body);
        if (jobposting) {
            await jobposting.update(req.body, { fields: ['id', 'description', 'deadline'] });
            res.status(202).json({ message: 'accepted' });
        } else {
            res.status(404).json({ message: 'not found' });
        }

    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'some error occured' })
    }
});

app.delete('/jobpostings/:jid', async (req, res) => {
    try {
        const jobposting = await JobPosting.findByPk(req.params.jid);
        if (jobposting) {
            await jobposting.destroy();
            res.status(202).json({ message: 'accepted' });
        } else {
            res.status(404).json({ message: 'not found' });
        }

    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'some error occured' })
    }
});

app.get('/jobpostings/:jid/candidates', async (req, res) => {
    try {
        const jobposting = await JobPosting.findByPk(req.params.jid);
        if (jobposting) {
            const candidate = await jobposting.getCandidates();
            res.status(200).json(candidate);
        } else {
            res.status(404).json({ message: 'not found' });
        }

    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'some error occured' })
    }
});

app.post('/jobpostings/:jid/candidates', async (req, res) => {
    try {
        const jobposting = await JobPosting.findByPk(req.params.jid);
        if (jobposting) {
            const candidate = req.body;
            candidate.jobId = jobposting.id;
            await Candidate.create(candidate);
            res.status(201).json({ message: 'created' });
        } else {
            res.status(404).json({ message: 'not found' });
        }

    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'some error occured' })
    }
});

app.get('/jobpostings/:jid/candidates/:cid', async (req, res) => {
    try {
        const jobposting = await JobPosting.findByPk(req.params.jid);
        if (jobposting) {
            const candidates = await jobposting.getCandidates({ where: { id: req.params.cid } });
            const candidate = candidates.shift();
            if (candidate) {
                res.status(200).json(candidate);
            }
            else {
                res.status(404).json({ message: 'candidate not found' });
            }
        } else {
            res.status(404).json({ message: 'job posting not found' });
        }

    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'some error occured' })
    }
});

app.put('/jobpostings/:jid/candidates/:cid', async (req, res) => {
    try {
        const jobposting = await JobPosting.findByPk(req.params.jid);
        if (jobposting) {
            const candidates = await jobposting.getCandidates({ where: { id: req.params.cid } });
            const candidate = candidates.shift();
            if (candidate) {
                await candidate.update(req.body);
                res.status(202).json({ message: 'accepted' });
            }
            else {
                res.status(404).json({ message: 'candidate not found' });
            }
        } else {
            res.status(404).json({ message: 'job posting not found' });
        }

    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'some error occured' })
    }
});

app.delete('/jobpostings/:jid/candidates/:cid', async (req, res) => {
    try {
        const jobposting = await JobPosting.findByPk(req.params.jid);
        if (jobposting) {
            const candidates = await jobposting.getCandidates({ where: { id: req.params.cid } });
            const candidate = candidates.shift();
            if (candidate) {
                await candidate.destroy();
                res.status(202).json({ message: 'accepted' });
            }
            else {
                res.status(404).json({ message: 'candidate not found' });
            }
        } else {
            res.status(404).json({ message: 'job posting not found' });
        }

    } catch (err) {
        console.warn(err);
        res.status(500).json({ message: 'some error occured' })
    }
});

app.listen(8080);