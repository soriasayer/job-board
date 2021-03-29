import {isLoggedIn, getAccessToken} from './auth';
import {ApolloClient, HttpLink, InMemoryCache, ApolloLink} from 'apollo-boost'
import gql from 'graphql-tag'

const endpointURL = 'http://localhost:9000/graphql'

const authLink = new ApolloLink((opration, forward) => {
  if(isLoggedIn()) {
    opration.setContext({
      headers: {
        'authorization': `Bearer ${getAccessToken()}`
      }
    })
  }
  return forward(opration)
})

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    new HttpLink({uri: endpointURL})
  ]),
  cache: new InMemoryCache()
})

const companyQuery = gql`
  query CompanyQuery($id: ID!){
    company(id: $id){
      id
      name
      description
      jobs{
        id
        title
      }
    }
  }
`

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    company{
      id
      name
    }
    description
  }
`

const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput){
    job:createJob(input: $input){
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`

const JobQuery = gql`
  query JobQuery($id: ID!){
    job(id: $id){
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`

const jobsQuery = gql`
  query JobsQuery {
    jobs {
      id
      title
      company {
        id
        name
      }
    }
  }
`

export const createJob = async(input) => { 
  const {data: {job}} = await client.mutate({
    mutation: createJobMutation,
    variables: {input},
    update: (cache, mutationResult) => {
      cache.writeQuery({
        query: JobQuery,
        variables: {id: mutationResult.data.job.id},
        data: mutationResult.data
      })
    }
  })
  return job
}

export const loadCompany = async(id) => {  
  const {data: {company}} = await client.query({query: companyQuery, variables: {id}})
  return company
}

export const loadJob = async (id) => {
 
  const {data: {job}} = await client.query({query: JobQuery, variables: {id}})
  return job
}

export const loadJobs = async () => {
  const {data: {jobs}} = await client.query({query: jobsQuery, fetchPolicy: 'no-cache'})
  return jobs
}