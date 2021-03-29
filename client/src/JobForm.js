import React, { useState } from 'react';
import { createJob } from './requests';

export const JobForm = ({history}) => {
  const [newJob, setNewJob] = useState({
    title: '',
    description: ''
  })

  const handleChange = (event) => {
    const {name, value} = event.target;
    
    setNewJob({
      ...newJob,
      [name]: value
    });
  }
  const handleClick = (event) => {
    event.preventDefault();
    const companyId = "SJV0-wdOM"
    const {title, description} = newJob
   createJob({companyId, title, description})
    .then((job) => {
      console.log(job)
      history.push(`/jobs/${job.id}`)
    })
  }

  return (
    <div>
      <h1 className="title">New Job</h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input className="input" type="text" name="title" value={newJob.title}
                onChange={handleChange} />
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea className="input" style={{height: '10em'}}
                name="description" value={newJob.description} onChange={handleChange} />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-link" onClick={handleClick}>Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
