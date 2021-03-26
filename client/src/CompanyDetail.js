import React, { useEffect, useState } from 'react';
import { JobList } from './JobList';
import { loadCompany } from './requests';

export const CompanyDetail = ({match}) => {
  const [company, setCompany] = useState(null)

  useEffect(() => {
    const fetchCampany = async() => {
      const {companyId} = match.params;
      const getCompany = await loadCompany(companyId)
      setCompany(getCompany)
    }
    fetchCampany()
  }, [])

  return (
    <div>
      {company &&
       (<>
        <h1 className="title">{company.name}</h1>
        <div className="box">{company.description}</div>
        <h5 className="title is-5" >Jobs at {company.name}</h5>
        <JobList jobs={company.jobs}/>
       </>)
        }
    </div>
  );
}
