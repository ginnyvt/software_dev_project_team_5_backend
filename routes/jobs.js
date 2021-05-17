const Job = require("./models/job.model");

/**
 * Endpoint for getting all jobs posted by employers from the database
 * This endpoint gets all jobs contained in the JOB DATABASE
 */
router.get("/getalljobs", async (req, res) => {
  try {
    const result = await Job.find({}).lean();
    if (!result.length) {
      res.status(404).send({ message: "DATABASE IS EMPTY" });
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * Endpoint for getting a particular job from the database
 * This endpoint gets a job from the database using the company name
 */

router.get("/getonejob", async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      res.status(400).send({ message: "ID NOT FOUND" });
    } else {
      const result = await Job.findById(id).lean();
      if (!result) {
        res.status(404).send({ message: "JOB NOT FOUND" });
      } else {
        res.status(200).send(result);
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * Endpoint for inserting/creating a new job into JOB DATABASE
 * This endpoint creates a new job into the database
 */

router.post("/insertjob/", async (req, res) => {
  try {
    const someJob = new Job({
      company: req.body.company,
      location: req.body.location,
      type: req.body.type,
      position: req.body.position,
      specialty: req.body.specialty,
      seniority: req.body.seniority,
      description: req.body.description,
      skills: req.body.skills,
      image: req.body.image,
    });
    await Job.create(someJob);
    res.status(201).send({ message: "JOB CREATED" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * Endpoint for deleting a job from JOB DATABASE
 * This endpoint deletes an existing job from the database by searching¨
 * for the job matching the id, deletes and returns the result
 */

router.delete("/deletejob/", async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      res.status(400).send({ message: "ID NOT FOUND" });
    } else {
      const result = await Job.findByIdAndDelete(id);
      if (result) {
        res.status(200).send({ message: "JOB DELETED" });
      } else {
        res.status(404).send({ message: "JOB NOT DELETED" });
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * Endpoint for updating a job in JOB DATABASE
 * This endpoint updates an existing job from the database
 */

router.put("/updatejob/", async (req, res) => {
  try {
    const id = req.body.id;
    const someJobUpdate = {
      company: req.body.company,
      location: req.body.location,
      type: req.body.type,
      position: req.body.position,
      specialty: req.body.specialty,
      seniority: req.body.seniority,
      description: req.body.description,
      skills: req.body.skills,
      image: req.body.image,
    };

    if (!id || !someJobUpdate) {
      res.status(400).send({ message: "missing parameter" });
    } else {
      const result = await Job.findByIdAndUpdate(id, { $set: someJobUpdate });
      if (!result) {
        res.status(404).send({ message: "JOB NOT UPDATED" });
      } else {
        res.status(200).send({ message: "JOB UPDATED" });
        2;
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
