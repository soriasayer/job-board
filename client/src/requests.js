import {isLoggedIn, getAccessToken} from './auth';

const endpointURL = 'http://localhost:9000/graphql'

export const graphqlRequest = async (query, variables={}) => {
  const request = {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({ query, variables })
  }

  if(isLoggedIn()) {
    request.headers['authorization'] = `Bearer ${getAccessToken()}`
  }
  const response = await fetch(endpointURL, request)
  const responseBody = await response.json()
    if(responseBody.errors){
      const message = responseBody.errors.map(error => error.message).join('/n')
      throw new Error(message)
    }
  return responseBody.data
  
}

export const createJob = async(input) => {
  const mutation = `
    mutation CreateJob($input: CreateJobInput){
      job:createJob(input: $input){
        id
        title
        description
        company{
          id
          name
        }
      }
    }
  `
  const data = await graphqlRequest(mutation, {input})
  return data.job
}

export const loadCompany = async(id) => {
  const query = `query CompanyQuery($id: ID!){
    company(id: $id){
      id
      name
      description
      jobs{
        id
        title
      }
    }
  }`

  const data = await graphqlRequest(query, {id})
  return data.company
}

export const loadJob = async (id) => {
  const query = `query JobQuery($id: ID!){
    job(id: $id){
      id
      title
      company{
        id
        name
      }
      description
    }
  }`

  const data = await graphqlRequest(query, {id})
  return data.job
}

export const loadJobs = async () => {
  const query = `{
    jobs{
      id
      title
      company {
        id
        name
      }
    }
  }`

  const data = await graphqlRequest(query)
  return data.jobs
}