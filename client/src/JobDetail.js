import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadJob } from './requests';

export const JobDetail = ({match}) => {
  const [job, setJob] = useState(null)

  useEffect(() => {
    const fetchJob = async() => {
      const {jobId} = match.params;
      const getJob = await loadJob(jobId)
      setJob(getJob)
    }
    fetchJob()
  }, [])

  return (
    <>
      {job ? (<div>
      <h1 className="title">{job.title}</h1>
      <h2 className="subtitle">
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className="box">{job.description}</div>
    </div>) : null}
    </>
  );
}
